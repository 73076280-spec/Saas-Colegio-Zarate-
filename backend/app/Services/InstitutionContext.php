<?php

namespace App\Services;

use Closure;
use Spatie\Permission\PermissionRegistrar;

class InstitutionContext
{
    private ?int $id = null;

    public function id(): ?int
    {
        return $this->id;
    }

    public function requireId(): int
    {
        return $this->id ?? throw new \LogicException('Institution context is required.');
    }

    public function set(?int $id): void
    {
        $this->id = $id;
        app(PermissionRegistrar::class)->setPermissionsTeamId($id);
    }

    public function run(int $id, Closure $callback): mixed
    {
        $previous = $this->id;
        $this->set($id);
        try {
            return $callback();
        } finally {
            $this->set($previous);
        }
    }
}
