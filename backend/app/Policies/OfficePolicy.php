<?php

namespace App\Policies;

use App\Models\Office\AcademicDocument;
use App\Models\Office\AcademicRequest;
use App\Models\Office\Communication;
use App\Models\Office\OfficeRecord;
use App\Models\User;
use App\Services\Office\OfficeAccess;

class OfficePolicy
{
    public function __construct(private OfficeAccess $access) {}

    public function view(User $u, OfficeRecord $record): bool
    {
        return match (true) {
            $record instanceof AcademicRequest => $this->access->requests($u)->whereKey($record->id)->exists(),
            $record instanceof AcademicDocument => $this->access->documents($u)->whereKey($record->id)->exists(),
            $record instanceof Communication => $this->access->communications($u)->whereKey($record->id)->exists(),
            default => false,
        };
    }

    public function create(User $u, string $kind): bool
    {
        return $kind === 'requests' ? $u->can('requests.create') && count($this->access->students($u)) > 0 : $this->access->staff($u, "$kind.create");
    }

    public function update(User $u, OfficeRecord $r): bool
    {
        if ($r instanceof AcademicRequest) {
            return $this->view($u, $r) && ($this->access->staff($u, 'requests.review') || ($u->can('requests.create') && in_array($r->student_id, $this->access->students($u), true)));
        }

        return $r instanceof Communication && $this->access->staff($u, 'communications.create');
    }

    public function review(User $u, AcademicRequest $r): bool
    {
        return $this->access->staff($u, 'requests.review') && $this->view($u, $r);
    }

    public function observe(User $u, AcademicRequest $r): bool
    {
        return $this->access->staff($u, 'requests.observe') && $this->view($u, $r);
    }

    public function approve(User $u, AcademicRequest $r): bool
    {
        return $this->access->staff($u, 'requests.approve') && $this->view($u, $r);
    }

    public function reject(User $u, AcademicRequest $r): bool
    {
        return $this->access->staff($u, 'requests.reject') && $this->view($u, $r);
    }

    public function complete(User $u, AcademicRequest $r): bool
    {
        return $this->access->staff($u, 'requests.complete') && $this->view($u, $r);
    }

    public function issue(User $u, AcademicDocument $r): bool
    {
        return $this->access->staff($u, 'documents.issue') && $this->view($u, $r);
    }

    public function publish(User $u, Communication $r): bool
    {
        return $this->access->staff($u, 'communications.publish') && $this->view($u, $r);
    }

    public function archive(User $u, Communication $r): bool
    {
        return $this->access->staff($u, 'communications.archive') && $this->view($u, $r);
    }
}
