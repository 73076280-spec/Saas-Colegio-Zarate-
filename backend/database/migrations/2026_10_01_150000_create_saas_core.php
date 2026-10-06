<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('institutions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('legal_name')->nullable();
            $table->string('code', 40)->unique();
            $table->string('tax_id', 30)->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('address')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('status', 20)->default('ACTIVE');
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('institution_id')->nullable()->constrained()->restrictOnDelete();
            $table->string('first_name', 100)->nullable();
            $table->string('last_name', 100)->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('avatar_path')->nullable();
            $table->string('status', 20)->default('ACTIVE');
            $table->boolean('must_change_password')->default(true);
            $table->timestamp('last_login_at')->nullable();
            $table->softDeletes();
        });
        // Preserve any pre-existing scaffold accounts; do not discard user data.
        if (DB::table('users')->exists()) {
            $id = DB::table('institutions')->insertGetId([
                'name' => 'Colegio Zárate de Huancayo', 'code' => 'ZARATE', 'status' => 'ACTIVE',
                'created_at' => now(), 'updated_at' => now(),
            ]);
            DB::table('users')->orderBy('id')->each(function ($user) use ($id) {
                $parts = explode(' ', $user->name, 2);
                DB::table('users')->where('id', $user->id)->update([
                    'institution_id' => $id, 'first_name' => $parts[0], 'last_name' => $parts[1] ?? '',
                ]);
            });
        }
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('institution_id')->nullable(false)->change();
            $table->string('first_name', 100)->nullable(false)->change();
            $table->string('last_name', 100)->nullable(false)->change();
            $table->dropUnique('users_email_unique');
            $table->unique(['institution_id', 'email']);
            $table->dropColumn('name');
        });
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->restrictOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action', 30);
            $table->string('entity_type')->nullable();
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->index(['institution_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->default('');
            $table->dropUnique(['institution_id', 'email']);
            $table->dropForeign(['institution_id']);
            $table->dropColumn(['institution_id', 'first_name', 'last_name', 'phone', 'avatar_path', 'status', 'must_change_password', 'last_login_at', 'deleted_at']);
        });
        // No global email unique index: tenants may legitimately share the same email.
        Schema::dropIfExists('institutions');
    }
};
