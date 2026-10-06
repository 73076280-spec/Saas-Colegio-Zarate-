<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Academic\AcademicListRequest;
use App\Http\Requests\Academic\SaveAcademicRequest;
use App\Services\Academic\AcademicCatalog;
use App\Services\Academic\AcademicService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AcademicController extends Controller
{
    public function index(AcademicListRequest $request)
    {
        $catalog = $request->route('catalog');
        $filters = $request->validated();
        $query = AcademicCatalog::model($catalog)::with(AcademicCatalog::RELATIONS[$catalog]);
        if (! empty($filters['search'])) {
            $search = '%'.addcslashes($filters['search'], '%_\\').'%';
            $query->where(function ($q) use ($search, $catalog) {
                $q->where('name', 'like', $search);
                if (in_array($catalog, ['education-levels', 'grade-levels', 'subjects'])) {
                    $q->orWhere('code', 'like', $search);
                }
            });
        }
        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        foreach (AcademicCatalog::FILTERS[$catalog] as $field) {
            if (isset($filters[$field])) {
                $query->where($field, $filters[$field]);
            }
        }
        match ($catalog) {
            'academic-years' => $query->orderByDesc('start_date'),
            'academic-periods' => $query->orderBy('academic_year_id')->orderBy('sequence'),
            'education-levels','grade-levels' => $query->orderBy('sort_order')->orderBy('name'),
            default => $query->orderBy('name'),
        };

        return $query->orderBy('id')->paginate($filters['per_page'] ?? 15)->withQueryString();
    }

    public function show(Request $request)
    {
        $catalog = $request->route('catalog');
        $record = AcademicCatalog::model($catalog)::findOrFail($request->route('record'));
        Gate::authorize('view', $record);
        $relations = AcademicCatalog::RELATIONS[$catalog];
        if ($catalog === 'academic-years') {
            $relations[] = 'periods';
        }

        return response()->json(['data' => $record->load($relations)]);
    }

    public function store(SaveAcademicRequest $request, AcademicService $service)
    {
        return response()->json(['data' => $service->save($request->route('catalog'), $request->validated(), $request)], 201);
    }

    public function update(SaveAcademicRequest $request, AcademicService $service)
    {
        return response()->json(['data' => $service->save($request->route('catalog'), $request->validated(), $request, $request->record(), $request->route('operation'))]);
    }
}
