<?php

namespace Database\Seeders;

use App\Models\Classroom\CourseUnit;
use App\Models\Classroom\Material;
use App\Models\Courses\Course;
use App\Models\Institution;
use App\Models\User;
use App\Services\Classroom\ClassroomService;
use App\Services\InstitutionContext;
use Illuminate\Database\Seeder;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

class ClassroomDemoSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local', 'testing')) {
            throw new \LogicException('Demo local/testing only.');
        }
        $institution = Institution::where('code', 'ZARATE')->firstOrFail();
        app(InstitutionContext::class)->run($institution->id, function () {
            $this->call(ClassroomPermissionSeeder::class);
            $admin = User::where('email', 'administrator@zarate.test')->firstOrFail();
            $service = app(ClassroomService::class);
            foreach (Course::whereIn('code', ['DEMO-MAT-2026', 'DEMO-COM-2026', 'DEMO-CYT-2026', 'DEMO-ING-2026'])->with('subject')->get() as $course) {
                $request = Request::create('/demo', 'POST');
                $request->setUserResolver(fn () => $admin);
                $subject = $course->subject->name;
                $unitTitles = $course->code === 'DEMO-MAT-2026'
                    ? [1 => 'Unidad 1: números naturales', 2 => 'Unidad 2: operaciones básicas']
                    : [1 => 'Unidad 1: '.$subject, 2 => 'Unidad 2: práctica de '.$subject];
                foreach ($unitTitles as $sequence => $title) {
                    if (! CourseUnit::withTrashed()->where('course_id', $course->id)->where('sequence', $sequence)->exists()) {
                        $unit = $service->save('course-units', $course->id, ['title' => $title, 'sequence' => $sequence, 'description' => 'Unidad ficticia para desarrollo.'], $request);
                        if ($sequence === 1) {
                            $service->save('course-units', $course->id, [], $request, $unit->id, 'publish');
                        }
                    }
                }
                $unit = CourseUnit::where('course_id', $course->id)->where('sequence', 1)->where('status', 'PUBLISHED')->first();
                if (! $unit) {
                    continue;
                }
                $materialTitles = $course->code === 'DEMO-MAT-2026'
                    ? ['FILE' => 'Guía de números naturales (demo)', 'LINK' => 'Enlace de consulta (demo)']
                    : ['FILE' => 'Guía de '.$subject.' (demo)', 'LINK' => 'Enlace de consulta: '.$subject.' (demo)'];
                foreach ($materialTitles as $type => $title) {
                    if (Material::withTrashed()->where('course_id', $course->id)->where('title', $title)->exists()) {
                        continue;
                    }
                    $payload = ['title' => $title, 'type' => $type, 'course_unit_id' => $unit->id, 'description' => 'Recurso ficticio para verificar el Aula Virtual.'];
                    $r = clone $request;
                    if ($type === 'FILE') {
                        $r->files->set('file', new UploadedFile(database_path('fixtures/classroom-demo.txt'), 'classroom-demo.txt', 'text/plain', null, true));
                    } else {
                        $payload['external_url'] = 'https://example.org';
                    }
                    $material = $service->save('materials', $course->id, $payload, $r);
                    $service->save('materials', $course->id, [], $request, $material->id, 'publish');
                }
            }
        });
    }
}
