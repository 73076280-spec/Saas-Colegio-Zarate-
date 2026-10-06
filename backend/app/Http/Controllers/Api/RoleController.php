<?php

namespace App\Http\Controllers\Api;

use App\Enums\RoleName;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateRoleRequest;
use App\Models\Role;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', Role::class);

        return response()->json(['data' => Role::with('permissions')->orderBy('id')->get()]);
    }

    public function permissions()
    {
        Gate::authorize('viewAny', Role::class);

        return response()->json(['data' => Permission::where('guard_name', 'web')->pluck('name')]);
    }

    public function update(UpdateRoleRequest $request, Role $role)
    {
        abort_if($role->name === RoleName::ADMINISTRATOR->value, 422, 'Los permisos del administrador están protegidos.');
        foreach ($request->validated('permissions') as $permission) {
            abort_unless($request->user()->can($permission), 403);
        }
        DB::transaction(fn () => $role->syncPermissions($request->validated('permissions')));

        return response()->json(['data' => $role->load('permissions')]);
    }
}
