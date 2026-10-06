<?php

namespace App\Services\Reports;

use App\Models\User;

class DashboardData
{
    public array $cards = [];

    public array $sections = [];

    public array $links = [];

    public function __construct(private User $user) {}

    public function metric(string $permission, string $label, callable $query): void
    {
        if ($this->user->can($permission)) {
            $this->cards[] = ['label' => $label, 'value' => $query()];
        }
    }

    public function link(string $permission, string $label, string $path): void
    {
        if ($this->user->can($permission)) {
            $this->links[] = compact('label', 'path');
        }
    }

    public function table(string $permission, string $title, callable $query): void
    {
        if ($this->user->can($permission)) {
            $this->sections[] = ['title' => $title, 'rows' => $query()];
        }
    }

    public function toArray(): array
    {
        return ['cards' => $this->cards, 'sections' => $this->sections, 'links' => $this->links];
    }
}
