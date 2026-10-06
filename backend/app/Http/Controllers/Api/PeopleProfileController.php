<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FamilyResource;
use App\Http\Resources\PersonResource;
use App\Models\People\StudentGuardian;
use App\Services\People\PeopleCatalog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PeopleProfileController extends Controller
{
    public function show(Request $request)
    {
        Gate::authorize('profile.view');
        $profiles = [];
        foreach (PeopleCatalog::MODELS as $type => $model) {
            $person = $model::with('user')->where('user_id', $request->user()->id)->first();
            $profiles[$type] = $person ? (new PersonResource($person))->resolve($request) : null;
        }

        return response()->json(['data' => $profiles]);
    }

    public function family(Request $request)
    {
        Gate::authorize('profile.view');
        $query = StudentGuardian::with(['student.user', 'guardian.user'])->where(function ($q) use ($request) {
            $q->whereHas('student', fn ($p) => $p->where('user_id', $request->user()->id))
                ->orWhereHas('guardian', fn ($p) => $p->where('user_id', $request->user()->id));
        });

        return FamilyResource::collection($query->orderByDesc('is_primary')->orderBy('id')->paginate(15));
    }
}
