<?php

use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

it('se conecta únicamente a la base MySQL de testing', function () {
    expect(app()->environment())->toBe('testing');
    expect(config('database.default'))->toBe('mysql');
    expect(config('database.connections.mysql.database'))->toBe('zarate_test');
    expect(config('database.connections.mysql.username'))->toBe('zarate_test');

    $connection = DB::connection();
    expect($connection->getPdo()->getAttribute(PDO::ATTR_DRIVER_NAME))->toBe('mysql');
    expect($connection->selectOne('SELECT DATABASE() AS name')->name)->toBe('zarate_test');
    expect((int) $connection->selectOne('SELECT 1 AS healthy')->healthy)->toBe(1);
})->group('mysql');

it('impide que el usuario de testing consulte desarrollo', function () {
    expect(config('database.connections.mysql.database'))->toBe('zarate_test');
    expect(config('database.connections.mysql.username'))->toBe('zarate_test');

    try {
        DB::select('SELECT 1 FROM zarate_dev.migrations LIMIT 1');
        $this->fail('El usuario de testing obtuvo acceso a desarrollo.');
    } catch (QueryException $exception) {
        expect($exception->errorInfo[0])->toBe('42000');
    }
})->group('mysql');
