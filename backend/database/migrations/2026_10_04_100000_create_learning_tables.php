<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assessment_types', function (Blueprint $t) {
            $t->id();
            $t->foreignId('institution_id')->constrained()->restrictOnDelete();
            $t->string('name', 100);
            $t->string('code', 40);
            $t->decimal('weight', 8, 2)->nullable();
            $t->string('status', 16)->default('ACTIVE');
            $t->timestamps();
            $t->unique(['institution_id', 'code']);
        });
        Schema::create('assignments', function (Blueprint $t) {
            $t->id();
            $t->foreignId('institution_id')->constrained()->restrictOnDelete();
            $t->foreignId('course_id')->constrained()->restrictOnDelete();
            $t->foreignId('course_unit_id')->nullable()->constrained()->restrictOnDelete();
            $t->string('title', 180);
            $t->text('description');
            $t->text('instructions')->nullable();
            $t->timestamp('due_at');
            $t->decimal('max_score', 4, 2)->nullable();
            $t->boolean('allow_late_submission')->default(false);
            $t->string('status', 16)->default('DRAFT');
            $t->timestamp('published_at')->nullable();
            $t->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $t->timestamps();
            $t->softDeletes();
            $t->index(['institution_id', 'course_id', 'status']);
        });
        Schema::create('assignment_submissions', function (Blueprint $t) {
            $t->id();
            $t->foreignId('institution_id')->constrained()->restrictOnDelete();
            $t->foreignId('assignment_id')->constrained()->restrictOnDelete();
            $t->foreignId('student_id')->constrained()->restrictOnDelete();
            $t->unsignedInteger('attempt')->default(1);
            $t->text('content')->nullable();
            $t->string('file_path')->nullable();
            $t->string('original_filename')->nullable();
            $t->string('mime_type')->nullable();
            $t->unsignedBigInteger('file_size')->nullable();
            $t->timestamp('submitted_at');
            $t->boolean('is_late')->default(false);
            $t->string('status', 16);
            $t->text('feedback')->nullable();
            $t->foreignId('reviewed_by')->nullable()->constrained('users')->restrictOnDelete();
            $t->timestamp('reviewed_at')->nullable();
            $t->timestamps();
            $t->unique(['assignment_id', 'student_id', 'attempt'], 'submission_attempt_unique');
        });
        Schema::create('assessments', function (Blueprint $t) {
            $t->id();
            $t->foreignId('institution_id')->constrained()->restrictOnDelete();
            $t->foreignId('course_id')->constrained()->restrictOnDelete();
            $t->foreignId('academic_period_id')->constrained()->restrictOnDelete();
            $t->foreignId('assessment_type_id')->constrained()->restrictOnDelete();
            $t->string('title', 180);
            $t->text('description')->nullable();
            $t->decimal('max_score', 4, 2)->default(20);
            $t->decimal('weight', 8, 2)->nullable();
            $t->date('evaluation_date')->nullable();
            $t->string('status', 16)->default('DRAFT');
            $t->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $t->timestamps();
        });
        Schema::create('scores', function (Blueprint $t) {
            $t->id();
            $t->foreignId('institution_id')->constrained()->restrictOnDelete();
            $t->foreignId('assessment_id')->constrained()->restrictOnDelete();
            $t->foreignId('student_id')->constrained()->restrictOnDelete();
            $t->decimal('score', 4, 2);
            $t->text('observations')->nullable();
            $t->foreignId('graded_by')->constrained('users')->restrictOnDelete();
            $t->timestamp('graded_at');
            $t->timestamps();
            $t->unique(['assessment_id', 'student_id']);
        });
        Schema::create('score_history', function (Blueprint $t) {
            $t->id();
            $t->foreignId('institution_id')->constrained()->restrictOnDelete();
            $t->foreignId('score_id')->constrained()->restrictOnDelete();
            $t->decimal('old_score', 4, 2)->nullable();
            $t->decimal('new_score', 4, 2);
            $t->foreignId('changed_by')->constrained('users')->restrictOnDelete();
            $t->text('reason')->nullable();
            $t->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        foreach (['score_history', 'scores', 'assessments', 'assignment_submissions', 'assignments', 'assessment_types'] as $table) {
            Schema::dropIfExists($table);
        }
    }
};
