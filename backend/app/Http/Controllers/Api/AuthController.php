<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Services\InstitutionContext;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(LoginRequest $request, AuthService $service, InstitutionContext $context)
    {
        $user = $service->login($request->validated(), $request);

        return $context->run((int) $user->institution_id, fn () => (new UserResource($user))->response());
    }

    public function me(Request $request)
    {
        return new UserResource($request->user());
    }

    public function logout(Request $request, AuthService $service)
    {
        $service->logout($request);

        return response()->noContent();
    }

    public function changePassword(ChangePasswordRequest $request, AuthService $service)
    {
        $service->changePassword($request, $request->validated('password'));

        return new UserResource($request->user());
    }
}
