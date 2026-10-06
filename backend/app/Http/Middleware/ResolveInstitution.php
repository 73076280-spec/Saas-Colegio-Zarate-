<?php

namespace App\Http\Middleware;

use App\Enums\InstitutionStatus;
use App\Enums\UserStatus;
use App\Services\InstitutionContext;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ResolveInstitution
{
    public function handle(Request $request, Closure $next)
    {
        $context = app(InstitutionContext::class);
        $context->set(null);
        $user = $request->user();
        try {
            if (! $user || $user->status !== UserStatus::ACTIVE || ! $user->institution ||
                $user->institution->status !== InstitutionStatus::ACTIVE ||
                ($request->hasSession() && $request->session()->has('auth_password_hash') &&
                ! hash_equals($user->password, $request->session()->get('auth_password_hash')))) {
                if ($request->hasSession()) {
                    Auth::guard('web')->logout();
                    $request->session()->invalidate();
                    $request->session()->regenerateToken();
                }
                abort(401, 'La sesión no está disponible.');
            }
            $context->set((int) $user->institution_id);
            $user->unsetRelation('roles')->unsetRelation('permissions');

            return $next($request);
        } finally {
            $context->set(null);
            $user?->unsetRelation('roles')->unsetRelation('permissions');
        }
    }
}
