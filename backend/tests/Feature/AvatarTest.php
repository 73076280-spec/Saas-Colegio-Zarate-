<?php

use App\Models\Institution;
use App\Models\User;
use App\Services\InstitutionContext;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

uses(DatabaseTransactions::class);

beforeEach(function () {
    expect(DB::connection()->getDatabaseName())->toBe('zarate_test');
    Storage::fake('avatars');
    $this->institution = Institution::factory()->create();
    $this->actor = app(InstitutionContext::class)->run($this->institution->id, function () {
        (new RolePermissionSeeder)->run();
        $user = User::factory()->create();
        $user->assignRole('STUDENT');

        return $user;
    });
    $this->withHeaders(['Origin' => 'http://localhost:5173', 'Accept' => 'application/json']);
});

function avatarImage(): UploadedFile
{
    return UploadedFile::fake()->createWithContent('profile.png', base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aS1cAAAAASUVORK5CYII='));
}

function avatarAs($test, User $user): void
{
    Auth::forgetGuards();
    app('session')->flush();
    $test->actingAs($user, 'web');
}

it('uploads replaces reads and removes the own private avatar without exposing its path', function () {
    $response = $this->actingAs($this->actor)->post('/api/v1/profile/avatar', ['photo' => avatarImage()])->assertOk()->assertJsonPath('data.avatar_path', null);
    $url = $response->json('data.avatar_url');
    expect($url)->toStartWith('/api/v1/users/'.$this->actor->id.'/avatar?v=');
    $this->get($url)->assertOk()->assertHeader('X-Content-Type-Options', 'nosniff')->assertHeader('Content-Type', 'image/png');
    $next = $this->post('/api/v1/profile/avatar', ['photo' => avatarImage()])->assertOk();
    expect($next->json('data.avatar_url'))->not->toBe($url);
    $this->deleteJson('/api/v1/profile/avatar')->assertOk()->assertJsonPath('data.avatar_url', null);
    $this->get($url)->assertNotFound();
});

it('rejects unsafe and oversized files and unauthorized profile changes', function () {
    $this->actingAs($this->actor)->post('/api/v1/profile/avatar', ['photo' => UploadedFile::fake()->createWithContent('image.svg', '<svg xmlns="http://www.w3.org/2000/svg"/>')])->assertUnprocessable()->assertJsonValidationErrors('photo');
    $small = avatarImage();
    $large = UploadedFile::fake()->createWithContent('large.png', file_get_contents($small->getPathname()).str_repeat('x', 2100000));
    $this->post('/api/v1/profile/avatar', ['photo' => $large])->assertUnprocessable()->assertJsonValidationErrors('photo');
    $outsider = app(InstitutionContext::class)->run($this->institution->id, fn () => User::factory()->create());
    avatarAs($this, $outsider);
    $this->post('/api/v1/profile/avatar', ['photo' => avatarImage()])->assertForbidden();
    $this->deleteJson('/api/v1/profile/avatar')->assertForbidden();
    expect(Storage::disk('avatars')->allFiles())->toBeEmpty();
});

it('denies peer and cross institution avatar access while allowing authorized administration', function () {
    $url = $this->actingAs($this->actor)->post('/api/v1/profile/avatar', ['photo' => avatarImage()])->assertOk()->json('data.avatar_url');
    [$peer, $admin] = app(InstitutionContext::class)->run($this->institution->id, function () {
        $peer = User::factory()->create();
        $peer->assignRole('STUDENT');
        $admin = User::factory()->create();
        $admin->assignRole('ADMINISTRATOR');

        return [$peer, $admin];
    });
    avatarAs($this, $peer);
    $this->get($url)->assertForbidden();
    avatarAs($this, $admin);
    $this->get($url)->assertOk();
    $other = Institution::factory()->create();
    $foreign = app(InstitutionContext::class)->run($other->id, function () {
        (new RolePermissionSeeder)->run();
        $user = User::factory()->create();
        $user->assignRole('ADMINISTRATOR');

        return $user;
    });
    avatarAs($this, $foreign);
    $this->get($url)->assertNotFound();
});
