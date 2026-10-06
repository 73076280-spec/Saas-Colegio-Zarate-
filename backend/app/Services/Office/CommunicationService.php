<?php

namespace App\Services\Office;

use App\Models\Office\Communication;
use App\Services\Enrollment\EnrollmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class CommunicationService
{
    public function save(array $data, Request $request, ?int $id = null): Communication
    {
        return DB::transaction(function () use ($data, $request, $id) {
            app(EnrollmentService::class)->lock();
            $r = $id ? Communication::lockForUpdate()->findOrFail($id) : new Communication;
            Gate::forUser($request->user())->authorize($id ? 'update' : 'create', $id ? $r : [Communication::class, 'communications']);
            if ($id && $r->status !== 'DRAFT') {
                app(RequestService::class)->fail('status', 'Solo se edita un borrador.');
            }
            $old = $id ? $r->attributesToArray() + ['targets' => $r->targets()->get(['kind', 'target'])->toArray()] : null;
            $targets = isset($data['targets']) ? app(CommunicationRecipients::class)->validate($data['targets']) : null;
            $r->fill(array_intersect_key($data, array_flip(['title', 'body'])));
            if (! $id) {
                $r->fill(['status' => 'DRAFT', 'created_by' => $request->user()->id]);
            }
            $r->save();
            if ($targets !== null) {
                $r->targets()->delete();
                $r->targets()->createMany($targets);
            }
            app(OfficeAudit::class)->record($r, $id ? 'UPDATE' : 'CREATE', $old, $request);

            return $r;
        });
    }

    public function transition(int $id, string $operation, Request $request): Communication
    {
        return DB::transaction(function () use ($id, $operation, $request) {
            app(EnrollmentService::class)->lock();
            $r = Communication::lockForUpdate()->findOrFail($id);
            Gate::forUser($request->user())->authorize($operation, $r);
            if (($operation === 'publish' && $r->status !== 'DRAFT') || ($operation === 'archive' && $r->status === 'ARCHIVED')) {
                app(RequestService::class)->fail('status', 'Transición no permitida.');
            }
            $old = $r->attributesToArray() + ['targets' => $r->targets()->get(['kind', 'target'])->toArray()];
            if ($operation === 'publish') {
                $targets = app(CommunicationRecipients::class)->validate($r->targets()->get(['kind', 'target'])->toArray());
                $users = app(CommunicationRecipients::class)->resolve($targets);
                if ($users->isEmpty()) {
                    app(RequestService::class)->fail('targets', 'No hay destinatarios activos para publicar.');
                }
                $r->fill(['status' => 'PUBLISHED', 'published_at' => now()])->save();
                app(OfficeNotifications::class)->send($users, 'communication', $r->id, 'Nuevo comunicado: '.$r->title, '/app/communications?communication='.$r->id);
            } else {
                $r->update(['status' => 'ARCHIVED']);
            }
            app(OfficeAudit::class)->record($r, strtoupper($operation), $old, $request);

            return $r->refresh();
        });
    }
}
