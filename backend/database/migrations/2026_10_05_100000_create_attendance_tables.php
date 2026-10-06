<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_sessions', function (Blueprint $t) {
            $t->id();
            $t->foreignId('institution_id')->constrained()->restrictOnDelete();
            $t->foreignId('course_id')->constrained()->restrictOnDelete();
            $t->date('date');
            $t->string('topic', 250)->nullable();
            $t->string('status', 16)->default('OPEN');
            $t->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $t->timestamp('closed_at')->nullable();
            $t->timestamps();
            $t->unique(['course_id', 'date']);
        });
        Schema::create('attendance_records', function (Blueprint $t) {
            $t->id();
            $t->foreignId('institution_id')->constrained()->restrictOnDelete();
            $t->foreignId('attendance_session_id')->constrained()->restrictOnDelete();
            $t->foreignId('student_id')->constrained()->restrictOnDelete();
            $t->string('status', 16);
            $t->text('observations')->nullable();
            $t->foreignId('recorded_by')->constrained('users')->restrictOnDelete();
            $t->timestamps();
            $t->unique(['attendance_session_id', 'student_id'], 'attendance_student_unique');
        });
        Schema::create('absence_justifications', function (Blueprint $t) {
            $t->id();
            $t->foreignId('institution_id')->constrained()->restrictOnDelete();
            $t->foreignId('attendance_record_id')->constrained()->restrictOnDelete();
            $t->foreignId('student_id')->constrained()->restrictOnDelete();
            $t->foreignId('guardian_id')->nullable()->constrained()->restrictOnDelete();
            $t->text('reason');
            $t->string('file_path')->nullable();
            $t->string('original_filename')->nullable();
            $t->string('mime_type')->nullable();
            $t->unsignedBigInteger('file_size')->nullable();
            $t->string('status', 16)->default('PENDING');
            $t->foreignId('reviewed_by')->nullable()->constrained('users')->restrictOnDelete();
            $t->timestamp('reviewed_at')->nullable();
            $t->text('review_comment')->nullable();
            $t->timestamps();
            $t->unique('attendance_record_id');
            $t->index(['institution_id', 'status']);
        });
        Schema::create('justification_status_history', function (Blueprint $t) {
            $t->id();
            $t->foreignId('institution_id')->constrained()->restrictOnDelete();
            $t->foreignId('absence_justification_id')->constrained()->restrictOnDelete();
            $t->string('previous_status', 16)->nullable();
            $t->string('new_status', 16);
            $t->foreignId('changed_by')->constrained('users')->restrictOnDelete();
            $t->text('comment')->nullable();
            $t->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        foreach (['justification_status_history', 'absence_justifications', 'attendance_records', 'attendance_sessions'] as $table) {
            Schema::dropIfExists($table);
        }
    }
};
