<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReportRequest;
use App\Services\Reports\DashboardService;

class DashboardController extends Controller
{
    public function __invoke(ReportRequest $request, DashboardService $service)
    {
        return response()->json($service->data($request->user(), $request->validated('academic_year_id')));
    }
}
