<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateInstitutionRequest;
use App\Models\Institution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class InstitutionController extends Controller
{
    public function index(Request $request)
    {
        $institution = $request->user()->institution;
        Gate::authorize('view', $institution);

        return response()->json(['data' => [$institution]]);
    }

    public function show(Institution $institution)
    {
        Gate::authorize('view', $institution);

        return response()->json(['data' => $institution]);
    }

    public function update(UpdateInstitutionRequest $request, Institution $institution)
    {
        $institution->update($request->validated());

        return response()->json(['data' => $institution]);
    }
}
