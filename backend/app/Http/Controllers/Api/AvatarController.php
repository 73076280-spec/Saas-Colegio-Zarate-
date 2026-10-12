<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadAvatarRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\AvatarService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class AvatarController extends Controller
{
    public function store(UploadAvatarRequest $request, AvatarService $service): UserResource
    {
        return new UserResource($service->save($request));
    }

    public function destroy(Request $request, AvatarService $service): UserResource
    {
        Gate::authorize('profile.update');

        return new UserResource($service->save($request, true));
    }

    public function show(User $user)
    {
        Gate::authorize('viewAvatar', $user);
        $disk = Storage::disk('avatars');
        abort_unless($user->avatar_path && str_starts_with($user->avatar_path, $user->institution_id.'/') && $disk->exists($user->avatar_path), 404);

        return response()->file($disk->path($user->avatar_path), [
            'Cache-Control' => 'private, no-store', 'X-Content-Type-Options' => 'nosniff',
            'Content-Security-Policy' => "default-src 'none'", 'Content-Type' => $disk->mimeType($user->avatar_path),
        ]);
    }
}
