<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaveUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class UserController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', User::class);

        return UserResource::collection(User::with(['institution', 'roles', 'permissions'])->orderBy('id')->paginate(20));
    }

    public function show(User $user)
    {
        Gate::authorize('view', $user);

        return new UserResource($user);
    }

    public function store(SaveUserRequest $request, UserService $service)
    {
        return (new UserResource($service->save($request->user(), $request->validated())))->response()->setStatusCode(201);
    }

    public function update(SaveUserRequest $request, User $user, UserService $service)
    {
        return new UserResource($service->save($request->user(), $request->validated(), $user));
    }

    public function disable(Request $request, User $user, UserService $service)
    {
        Gate::authorize('disable', $user);

        return new UserResource($service->disable($request->user(), $user));
    }
}
