<?php

namespace Database\Seeders;

use App\Models\Institution;
use App\Models\Office\AcademicRequest;
use App\Models\Office\Communication;
use App\Models\Office\RequestType;
use App\Models\User;
use App\Services\InstitutionContext;
use App\Services\Office\CommunicationService;
use App\Services\Office\RequestService;
use Illuminate\Database\Seeder;
use Illuminate\Http\Request;

class OfficeDemoSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local', 'testing')) {
            throw new \LogicException('Demo local/testing only.');
        }
        $institution = Institution::where('code', 'ZARATE')->firstOrFail();
        app(InstitutionContext::class)->run($institution->id, function () use ($institution) {
            $this->call(OfficePermissionSeeder::class);
            foreach (['CONSTANCIA' => 'Constancia', 'CERTIFICADO' => 'Certificado', 'CORRECCION_DATOS' => 'Corrección de datos', 'OTRO' => 'Otro'] as $code => $name) {
                RequestType::firstOrCreate(['code' => $code], ['name' => $name, 'status' => 'ACTIVE', 'description' => 'Tipo de solicitud demo.']);
            }
            $student = User::where('email', 'student@zarate.test')->firstOrFail();
            $secretary = User::where('email', 'secretary@zarate.test')->firstOrFail();
            $request = Request::create('/demo/office', 'POST');
            $request->setUserResolver(fn () => $student);
            $staff = clone $request;
            $staff->setUserResolver(fn () => $secretary);
            $type = RequestType::where('code', 'CONSTANCIA')->firstOrFail();
            foreach (['Constancia de estudios (demo registrada)' => false, 'Constancia con observación (demo)' => true] as $subject => $observe) {
                if (AcademicRequest::where('student_id', $student->student->id)->where('subject', $subject)->exists()) {
                    continue;
                }
                $r = app(RequestService::class)->save(['subject' => $subject, 'description' => 'Solicitud ficticia para desarrollo.', 'request_type_id' => $type->id], $request);
                if ($observe) {
                    app(RequestService::class)->transition($r->id, 'review', [], $staff);
                    app(RequestService::class)->transition($r->id, 'observe', ['comment' => 'Completar el motivo de la constancia. Datos ficticios.'], $staff);
                }
            }
            $title = 'Bienvenida a los trámites académicos (demo)';
            if (! Communication::where('title', $title)->exists()) {
                $c = app(CommunicationService::class)->save(['title' => $title, 'body' => 'Consulta Mis solicitudes y las notificaciones internas para seguir tus trámites. Comunicado ficticio de desarrollo.', 'targets' => [['kind' => 'institution', 'target' => (string) $institution->id]]], $staff);
                app(CommunicationService::class)->transition($c->id, 'publish', $staff);
            }
        });
    }
}
