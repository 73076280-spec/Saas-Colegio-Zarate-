<?php

namespace App\Services\Office;

use App\Models\Office\AcademicRequest;
use App\Models\Office\RequestType;
use App\Models\User;
use App\Services\Attendance\AttendanceAccess;
use App\Services\Enrollment\EnrollmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class RequestService
{
    public function fail(string $key, string $message): never
    {
        throw ValidationException::withMessages([$key => $message]);
    }

    public function save(array $data, Request $request, ?int $id = null): AcademicRequest
    {
        return DB::transaction(function () use ($data, $request, $id) {
            app(EnrollmentService::class)->lock();
            $data = array_intersect_key($data, array_flip(['student_id', 'request_type_id', 'subject', 'description', 'assigned_to']));
            $r = $id ? AcademicRequest::lockForUpdate()->findOrFail($id) : new AcademicRequest;
            Gate::forUser($request->user())->authorize($id ? 'update' : 'create', $id ? $r : [AcademicRequest::class, 'requests']);
            $old = $id ? $r->attributesToArray() : null;
            if (! $id) {
                $access = app(AttendanceAccess::class);
                $student = (int) ($data['student_id'] ?? $access->student($request->user())?->id);
                abort_unless(in_array($student, app(OfficeAccess::class)->students($request->user()), true), 403);
                if (! RequestType::where('status', 'ACTIVE')->whereKey($data['request_type_id'])->exists()) {
                    $this->fail('request_type_id', 'Selecciona un tipo activo de tu institución.');
                }
                $guardian = $access->student($request->user())?->id === $student ? null : $access->guardian($request->user())?->id;
                $data += ['request_code' => 'TMP-'.Str::uuid(), 'status' => 'REGISTERED'];
                $data['student_id'] = $student;
                $data['guardian_id'] = $guardian;
            } else {
                if (! in_array($r->status, ['REGISTERED', 'IN_REVIEW', 'OBSERVED'])) {
                    $this->fail('status', 'La solicitud conserva su resolución e historial.');
                }
                if (array_key_exists('assigned_to', $data)) {
                    abort_unless(app(OfficeAccess::class)->staff($request->user(), 'requests.review'), 403);
                    if ($data['assigned_to'] && ! User::where('status', 'ACTIVE')->role(['SECRETARY', 'ADMINISTRATOR'])->whereKey($data['assigned_to'])->exists()) {
                        $this->fail('assigned_to', 'Selecciona un responsable activo de tu institución.');
                    }
                }
                if (array_intersect(['subject', 'description'], array_keys($data))) {
                    if (! in_array($r->status, ['REGISTERED', 'OBSERVED'])) {
                        $this->fail('status', 'Solo se corrigen solicitudes registradas u observadas.');
                    }
                    abort_unless(in_array($r->student_id, app(OfficeAccess::class)->students($request->user()), true), 403);
                }
            }
            $r->fill($data)->save();
            if (! $id) {
                $r->update(['request_code' => 'SOL-'.now()->year.'-'.str_pad((string) $r->id, 6, '0', STR_PAD_LEFT)]);
                $r->history()->create(['previous_status' => null, 'new_status' => 'REGISTERED', 'changed_by' => $request->user()->id]);
            }
            app(OfficeAudit::class)->record($r, $id ? 'UPDATE' : 'CREATE', $old, $request);

            return $r->refresh();
        });
    }

    public function transition(int $id, string $operation, array $data, Request $request): AcademicRequest
    {
        return DB::transaction(function () use ($id, $operation, $data, $request) {
            app(EnrollmentService::class)->lock();
            $r = AcademicRequest::lockForUpdate()->findOrFail($id);
            Gate::forUser($request->user())->authorize($operation, $r);
            [$from,$to] = match ($operation) {
                'review' => [['REGISTERED', 'OBSERVED'], 'IN_REVIEW'],'observe' => [['IN_REVIEW'], 'OBSERVED'],
                'approve' => [['IN_REVIEW'], 'APPROVED'],'reject' => [['IN_REVIEW'], 'REJECTED'],'complete' => [['APPROVED'], 'COMPLETED'],
            };
            if (! in_array($r->status, $from)) {
                $this->fail('status', 'Transición no permitida desde el estado actual.');
            }
            $old = $r->attributesToArray();
            $r->fill(['status' => $to, 'assigned_to' => $r->assigned_to ?? $request->user()->id]);
            if (in_array($operation, ['approve', 'reject', 'complete'])) {
                $r->resolution = $data['resolution'];
            }
            $r->save();
            $r->history()->create(['previous_status' => $old['status'], 'new_status' => $to, 'changed_by' => $request->user()->id, 'comment' => $data['comment'] ?? $data['resolution'] ?? null]);
            app(OfficeAudit::class)->record($r, strtoupper($operation), $old, $request);
            app(OfficeNotifications::class)->request($r);

            return $r->refresh();
        });
    }
}
