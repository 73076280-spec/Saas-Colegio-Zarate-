<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['students', 'teachers', 'guardians'] as $name) {
            Schema::create($name, function (Blueprint $table) use ($name) {
                $table->id();
                $table->foreignId('institution_id')->constrained()->restrictOnDelete();
                $table->foreignId('user_id')->unique()->constrained()->restrictOnDelete();
                if ($name !== 'guardians') {
                    $table->string($name === 'students' ? 'student_code' : 'teacher_code', 40);
                }
                $table->string('document_type', 20);
                $table->string('document_number', 30);
                if ($name === 'students') {
                    $table->date('birth_date')->nullable();
                    $table->string('gender', 20)->nullable();
                    $table->date('admission_date')->nullable();
                }
                if ($name === 'teachers') {
                    $table->string('specialty')->nullable();
                    $table->date('hire_date')->nullable();
                }
                if ($name === 'guardians') {
                    $table->string('occupation')->nullable();
                }
                if ($name !== 'teachers') {
                    $table->string('address', 500)->nullable();
                }
                $table->string('status', 20)->default('ACTIVE');
                $table->timestamps();
                $table->softDeletes();
                $table->unique(['institution_id', 'document_number']);
                if ($name !== 'guardians') {
                    $table->unique(['institution_id', $name === 'students' ? 'student_code' : 'teacher_code']);
                }
                $table->unique(['institution_id', 'id']);
            });
        }
        Schema::create('student_guardian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->restrictOnDelete();
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('guardian_id');
            $table->foreign(['institution_id', 'student_id'])->references(['institution_id', 'id'])->on('students')->restrictOnDelete();
            $table->foreign(['institution_id', 'guardian_id'])->references(['institution_id', 'id'])->on('guardians')->restrictOnDelete();
            $table->string('relationship', 20);
            $table->boolean('is_primary')->default(false);
            $table->boolean('can_pick_up')->default(false);
            $table->boolean('receives_notifications')->default(false);
            $table->timestamps();
            $table->unique(['student_id', 'guardian_id']);
            $table->unsignedBigInteger('primary_student_id')->nullable()->storedAs('CASE WHEN is_primary = 1 THEN student_id ELSE NULL END')->unique();
        });
    }

    public function down(): void
    {
        foreach (['student_guardian', 'guardians', 'teachers', 'students'] as $table) {
            Schema::dropIfExists($table);
        }
    }
};
