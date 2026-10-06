<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReportRequest;
use App\Policies\ReportPolicy;
use App\Services\InstitutionContext;
use App\Services\Reports\ReportCatalog;
use App\Services\Reports\ReportService;

class ReportController extends Controller
{
    public function catalog(ReportRequest $r)
    {
        $items = [];
        foreach (ReportCatalog::ITEMS as $key => $definition) {
            if (app(ReportPolicy::class)->view($r->user(), $key)) {
                $items[] = ['id' => $key, 'name' => $definition[0], 'group' => $definition[1], 'filters' => ReportCatalog::filters($key)];
            }
        }

        return response()->json(['data' => $items]);
    }

    public function index(ReportRequest $r, ReportService $service)
    {
        $key = $r->route('report');
        $q = $service->query($r->user(), $key, $r->validated());

        return $q->paginate($r->validated('per_page') ?? 20)->through(fn ($row) => $service->row($key, $row));
    }

    public function export(ReportRequest $r, ReportService $service)
    {
        $key = $r->route('report');
        $q = $service->query($r->user(), $key, $r->validated());
        // Streaming runs after institution middleware has released its context.
        $institution = app(InstitutionContext::class)->requireId();

        return response()->streamDownload(function () use ($institution, $q, $service, $key) {
            app(InstitutionContext::class)->run($institution, function () use ($q, $service, $key) {
                $file = fopen('php://output', 'w');
                fwrite($file, "\xEF\xBB\xBF");
                $header = false;
                foreach ($q->lazy(200) as $record) {
                    $row = $service->row($key, $record);
                    if (! $header) {
                        fputcsv($file, array_keys($row), ',', '"', '');
                        $header = true;
                    }
                    fputcsv($file, array_map(self::csvCell(...), array_values($row)), ',', '"', '');
                }
                if (! $header) {
                    fputcsv($file, ['Sin resultados'], ',', '"', '');
                }
                fclose($file);
            });
        }, $key.'.csv', ['Content-Type' => 'text/csv; charset=UTF-8', 'Cache-Control' => 'private, no-store', 'X-Content-Type-Options' => 'nosniff']);
    }

    public static function csvCell(mixed $value): string
    {
        $text = (string) ($value ?? '');

        return preg_match('/^[\s\x00-\x1f]*[=+\-@]/u', $text) ? "'".$text : $text;
    }
}
