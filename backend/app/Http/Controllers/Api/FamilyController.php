<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\People\FamilyRequest;
use App\Http\Resources\FamilyResource;
use App\Models\People\Guardian;
use App\Services\People\FamilyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class FamilyController extends Controller
{
    public function index(FamilyRequest $request)
    {
        return FamilyResource::collection($request->student()->familyLinks()->with(['student.user', 'guardian.user'])->orderByDesc('is_primary')->orderBy('id')->paginate($request->validated('per_page', 15)));
    }

    public function store(FamilyRequest $request, FamilyService $service)
    {
        return (new FamilyResource($service->save($request->student(), $request->validated(), $request)))->response()->setStatusCode(201);
    }

    public function update(FamilyRequest $request, FamilyService $service)
    {
        return new FamilyResource($service->save($request->student(), $request->validated(), $request, $request->link()));
    }

    public function destroy(FamilyRequest $request, FamilyService $service)
    {
        $service->save($request->student(), [], $request, $request->link(), true);

        return response()->noContent();
    }

    public function students(Request $request)
    {
        Gate::authorize('student-guardians.view');
        $guardian = Guardian::findOrFail($request->route('guardian'));

        return FamilyResource::collection($guardian->familyLinks()->with(['student.user', 'guardian.user'])->orderBy('id')->paginate(15));
    }
}
