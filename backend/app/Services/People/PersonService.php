<?php

namespace App\Services\People;

use App\Enums\AuditAction;
use App\Enums\DocumentType;
use App\Enums\RoleName;
use App\Enums\UserStatus;
use App\Models\Institution;
use App\Models\People\Person;
use App\Models\Role;
use App\Models\User;
use App\Services\InstitutionContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class PersonService
{
    public function __construct(private PeopleAudit $audit) {}

    public function save(string $type, array $data, Request $request, ?Person $person = null, bool $disable = false): Person
    {
        return DB::transaction(function () use ($type, $data, $request, $person, $disable) {
            Institution::whereKey(app(InstitutionContext::class)->requireId())->lockForUpdate()->firstOrFail();
            $class = PeopleCatalog::model($type);
            if ($person) {
                $person = $class::lockForUpdate()->findOrFail($person->id);
            }
            $old = $person?->attributesToArray();
            $status = PeopleCatalog::status($type);
            if ($disable) {
                $data = ['status' => $status::INACTIVE->value];
            }
            if (isset($data['status']) && $data['status'] !== ($old['status'] ?? $status::ACTIVE->value)) {
                if ($person) {
                    Gate::authorize('disable', $person);
                } else {
                    Gate::authorize($type.'.disable');
                }
            }
            $values = array_merge($old ?? [], $data);
            if (($values['document_type'] ?? null) === DocumentType::DNI->value && ! preg_match('/^\d{8}$/', $values['document_number'])) {
                $this->invalid('document_number', 'El DNI debe contener exactamente 8 dígitos.');
            }
            if ($type === 'students' && ! empty($values['birth_date']) && ! empty($values['admission_date']) && $values['admission_date'] < $values['birth_date']) {
                $this->invalid('admission_date', 'El ingreso no puede ser anterior al nacimiento.');
            }
            foreach (array_filter(['document_number', $type === 'students' ? 'student_code' : ($type === 'teachers' ? 'teacher_code' : null)]) as $field) {
                if ($class::withTrashed()->where($field, $values[$field])->when($person, fn ($q) => $q->whereKeyNot($person->id))->exists()) {
                    $this->invalid($field, 'Ya existe un perfil con este documento o código en tu institución.');
                }
            }
            if (! $person) {
                if (isset($data['user_id'])) {
                    $user = User::findOrFail($data['user_id']);
                    $roles = $user->getRoleNames();
                    if (! $roles->contains(PeopleCatalog::role($type)->value) || $roles->diff([RoleName::STUDENT->value, RoleName::TEACHER->value, RoleName::GUARDIAN->value])->isNotEmpty()) {
                        $this->invalid('user_id', 'La cuenta no tiene un rol compatible. Un administrador debe revisar sus roles.');
                    }
                    if ($user->status !== UserStatus::ACTIVE) {
                        $this->invalid('user_id', 'La cuenta debe estar activa.');
                    }
                    if ($class::withTrashed()->where('user_id', $user->id)->exists()) {
                        $this->invalid('user_id', 'La cuenta ya tiene este perfil, incluso si fue archivado.');
                    }
                } else {
                    $account = $data['account'];
                    if (User::withTrashed()->where('email', $account['email'])->exists()) {
                        $this->invalid('account.email', 'Ya existe una cuenta con este correo. Reutiliza la cuenta compatible.');
                    }
                    $role = Role::where('name', PeopleCatalog::role($type)->value)->firstOrFail();
                    foreach ($role->permissions as $permission) {
                        // Student classroom reads are self-service, scoped by approved enrollment.
                        // Onboarding can delegate these scoped reads without granting staff classroom access.
                        $studentSelfService = $type === 'students' && in_array($permission->name, ['course-units.view', 'materials.view', 'assignments.view', 'submissions.view', 'assessments.view', 'scores.view'], true);
                        $guardianSelfService = $type === 'guardians' && $permission->name === 'justifications.create';
                        abort_unless($studentSelfService || $guardianSelfService || $request->user()->can($permission->name), 403);
                    }
                    $user = User::create($account + ['status' => UserStatus::ACTIVE, 'must_change_password' => true]);
                    $user->assignRole(PeopleCatalog::role($type)->value);
                }
                $person = new $class;
                $person->user_id = $user->id;
            }
            $person->fill(array_intersect_key($data, array_flip(PeopleCatalog::fields($type))))->save();
            $person->refresh();
            $action = $old === null ? AuditAction::CREATE : (($old['status'] !== $person->status->value && $person->status->value === $status::INACTIVE->value) ? AuditAction::DISABLE : AuditAction::UPDATE);
            $this->audit->record($action, $person, $old, $person->attributesToArray(), $request);

            return $person->load('user');
        }, 3);
    }

    private function invalid(string $field, string $message): never
    {
        throw ValidationException::withMessages([$field => $message]);
    }
}
