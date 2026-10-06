<?php

use Illuminate\Support\Facades\Route;

it('responde con la salud técnica sin depender de la base de datos', function () {
    $this->getJson('/api/health')
        ->assertOk()
        ->assertExactJson(['status' => 'ok', 'service' => 'backend']);
});

it('rechaza métodos no admitidos', function () {
    $this->postJson('/api/health')->assertStatus(405);
});

it('responde JSON para rutas API inexistentes', function () {
    $this->getJson('/api/no-existe')->assertNotFound()->assertJsonStructure(['message']);
});

it('impide acceso anónimo a una ruta protegida por Sanctum', function () {
    Route::middleware(['api', 'auth:sanctum'])
        ->get('/api/test-protected', fn () => ['private' => true]);

    $this->getJson('/api/test-protected')->assertUnauthorized();
});
