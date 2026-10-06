<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_concepts', function (Blueprint $t) {
            $t->id();
            $t->foreignId('institution_id')->constrained()->restrictOnDelete();
            $t->string('name');
            $t->string('code', 60);
            $t->text('description')->nullable();
            $t->decimal('amount', 12, 2);
            $t->string('status', 20)->default('ACTIVE');
            $t->timestamps();
            $t->unique(['institution_id', 'code']);
        });
        Schema::create('student_payments', function (Blueprint $t) {
            $t->id();
            $t->foreignId('institution_id')->constrained()->restrictOnDelete();
            $t->foreignId('student_id')->constrained()->restrictOnDelete();
            $t->foreignId('payment_concept_id')->constrained()->restrictOnDelete();
            $t->foreignId('academic_year_id')->constrained()->restrictOnDelete();
            $t->decimal('amount', 12, 2);
            $t->date('due_date')->nullable();
            $t->timestamp('paid_at')->nullable();
            $t->string('status', 20)->default('PENDING');
            $t->foreignId('validated_by')->nullable()->constrained('users')->restrictOnDelete();
            $t->text('observations')->nullable();
            $t->timestamps();
        });
        Schema::create('enrollments', function (Blueprint $t) {
            $t->id();
            $t->foreignId('institution_id')->constrained()->restrictOnDelete();
            $t->foreignId('student_id')->constrained()->restrictOnDelete();
            $t->foreignId('academic_year_id')->constrained()->restrictOnDelete();
            $t->foreignId('grade_level_id')->constrained()->restrictOnDelete();
            $t->foreignId('section_id')->constrained()->restrictOnDelete();
            $t->string('enrollment_code', 60);
            $t->timestamp('enrolled_at')->nullable();
            $t->string('status', 20)->default('DRAFT');
            $t->foreignId('approved_by')->nullable()->constrained('users')->restrictOnDelete();
            $t->timestamp('approved_at')->nullable();
            $t->text('observations')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['institution_id', 'enrollment_code']);
            $t->unsignedBigInteger('active_student_id')->nullable()->storedAs("CASE WHEN status IN ('DRAFT','PENDING','OBSERVED','APPROVED') THEN student_id ELSE NULL END");
            $t->unique(['institution_id', 'academic_year_id', 'active_student_id'], 'enrollment_active_unique');
            $t->index(['institution_id', 'section_id', 'status']);
        });
        Schema::create('enrollment_status_history', function (Blueprint $t) {
            $t->id();
            $t->foreignId('institution_id')->constrained()->restrictOnDelete();
            $t->foreignId('enrollment_id')->constrained()->restrictOnDelete();
            $t->string('previous_status', 20)->nullable();
            $t->string('new_status', 20);
            $t->foreignId('changed_by')->constrained('users')->restrictOnDelete();
            $t->text('comment')->nullable();
            $t->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        foreach (['enrollment_status_history', 'enrollments', 'student_payments', 'payment_concepts'] as $table) {
            Schema::dropIfExists($table);
        }
    }
};
