<?php

namespace App\Services;

use App\Enums\AuditAction;
use App\Enums\InstitutionStatus;
use App\Enums\UserStatus;
use App\Models\Institution;
use App\Models\Scopes\InstitutionScope;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function __construct(private InstitutionContext $context, private AuditService $audit) {}

    public function login(array $data, Request $request): User
    {
        abort_unless($request->hasSession(), 419, 'Inicializa la sesión desde la aplicación.');
        $institution = Institution::where('code', $data['institution_code'])->first();
        $user = $institution ? User::withoutGlobalScope(InstitutionScope::class)->where('institution_id', $institution->id)->where('email', $data['email'])->first() : null;
        // A dummy hash ensures unknown accounts still perform password verification.
        $valid = Hash::check($data['password'], $user?->password ?? '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.');
        abort_unless($valid && $user && $user->status === UserStatus::ACTIVE && $institution->status === InstitutionStatus::ACTIVE, 422, 'Credenciales incorrectas o cuenta no disponible.');
        $this->context->run((int) $user->institution_id, function () use ($user, $request) {
            DB::transaction(function () use ($user, $request) {
                $user->forceFill(['last_login_at' => now()])->save();
                $this->audit->record(AuditAction::LOGIN, $user, $request);
            });
        });
        Auth::guard('web')->login($user);
        $request->session()->regenerate();
        $request->session()->put('auth_password_hash', $user->password);

        return $user;
    }

    public function logout(Request $request): void
    {
        $this->audit->record(AuditAction::LOGOUT, $request->user(), $request);
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }

    public function changePassword(Request $request, string $password): void
    {
        $user = $request->user();
        DB::transaction(function () use ($user, $password) {
            $user->forceFill(['password' => $password, 'must_change_password' => false])->save();
            $user->tokens()->delete();
        });
        $request->session()->regenerate();
        $request->session()->put('auth_password_hash', $user->password);
    }
}
