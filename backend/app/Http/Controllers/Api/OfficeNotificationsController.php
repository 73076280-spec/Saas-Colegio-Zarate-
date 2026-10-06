<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\OfficeRequest;
use Illuminate\Support\Facades\Gate;

class OfficeNotificationsController extends Controller
{
    public function index(OfficeRequest $r)
    {
        Gate::authorize('notifications.view');
        $q = $r->user()->notifications();
        if ($r->validated('status') === 'unread') {
            $q->whereNull('read_at');
        }
        if ($r->validated('status') === 'read') {
            $q->whereNotNull('read_at');
        }
        $result = $q->paginate($r->validated('per_page') ?? 20)->through(fn ($n) => ['id' => $n->id, 'type' => $n->data['kind'] ?? 'internal', 'message' => $n->data['message'] ?? 'Notificación interna', 'path' => $n->data['path'] ?? null, 'read_at' => $n->read_at, 'created_at' => $n->created_at])->toArray();
        $result['unread_count'] = $r->user()->notifications()->whereNull('read_at')->count();

        return response()->json($result);
    }

    public function read(OfficeRequest $r)
    {
        Gate::authorize('notifications.view');
        if ($r->route('id')) {
            $r->user()->notifications()->findOrFail($r->route('id'))->markAsRead();
        } else {
            $r->user()->notifications()->whereNull('read_at')->update(['read_at' => now()]);
        }

        return response()->noContent();
    }
}
