<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        Gate::authorize('profile.view');

        return new UserResource($request->user());
    }

    public function update(UpdateProfileRequest $request)
    {
        $request->user()->update($request->validated());

        return new UserResource($request->user());
    }
}
