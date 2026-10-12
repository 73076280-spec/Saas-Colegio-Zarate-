<?php

namespace App\Services;

use App\Enums\AuditAction;
use App\Models\User;
use App\Services\People\PeopleAudit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class AvatarService
{
    public function save(Request $request, bool $remove = false): User
    {
        $path = $remove ? null : $request->file('photo')->store((string) $request->user()->institution_id, 'avatars');
        $old = null;
        try {
            $user = DB::transaction(function () use ($request, $path, &$old) {
                $user = User::whereKey($request->user()->id)->lockForUpdate()->firstOrFail();
                $old = $user->avatar_path;
                $user->forceFill(['avatar_path' => $path])->save();
                app(PeopleAudit::class)->record(AuditAction::UPDATE, $user, null, ['id' => $user->id], $request);

                return $user;
            });
        } catch (Throwable $exception) {
            if ($path) {
                Storage::disk('avatars')->delete($path);
            }
            throw $exception;
        }
        if ($old && str_starts_with($old, $user->institution_id.'/')) {
            DB::afterCommit(fn () => Storage::disk('avatars')->delete($old));
        }

        return $user;
    }
}
