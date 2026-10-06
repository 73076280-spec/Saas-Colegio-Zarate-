<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('request_types', function (Blueprint $t) {
            $t->id();
            $t->foreignId('institution_id')->constrained()->restrictOnDelete();
            $t->string('name');
            $t->string('code', 50);
            $t->text('description')->nullable();
            $t->string('status', 16)->default('ACTIVE');
            $t->timestamps();
            $t->unique(['institution_id', 'code']);
        });
        Schema::create('academic_requests', function (Blueprint $t) {
            $t->id();
            $t->foreignId('institution_id')->constrained()->restrictOnDelete();
            $t->string('request_code', 40);
            $t->foreignId('student_id')->constrained()->restrictOnDelete();
            $t->foreignId('guardian_id')->nullable()->constrained()->restrictOnDelete();
            $t->foreignId('request_type_id')->constrained()->restrictOnDelete();
            $t->string('subject', 180);
            $t->text('description');
            $t->string('status', 20)->default('REGISTERED');
            $t->foreignId('assigned_to')->nullable()->constrained('users')->restrictOnDelete();
            $t->text('resolution')->nullable();
            $t->timestamps();
            $t->unique('request_code');
            $t->index(['institution_id', 'status']);
        });
        Schema::create('request_status_history', function (Blueprint $t) {
            $t->id();
            $t->foreignId('institution_id')->constrained()->restrictOnDelete();
            $t->foreignId('academic_request_id')->constrained()->restrictOnDelete();
            $t->string('previous_status', 20)->nullable();
            $t->string('new_status', 20);
            $t->foreignId('changed_by')->constrained('users')->restrictOnDelete();
            $t->text('comment')->nullable();
            $t->timestamp('created_at')->useCurrent();
        });
        Schema::create('academic_documents', function (Blueprint $t) {
            $t->id();
            $t->foreignId('institution_id')->constrained()->restrictOnDelete();
            $t->foreignId('academic_request_id')->nullable()->constrained()->restrictOnDelete();
            $t->foreignId('student_id')->constrained()->restrictOnDelete();
            $t->string('document_type', 100);
            $t->string('document_number', 60);
            $t->string('file_path')->nullable();
            $t->string('original_filename')->nullable();
            $t->string('mime_type')->nullable();
            $t->unsignedBigInteger('file_size')->nullable();
            $t->timestamp('issued_at')->nullable();
            $t->foreignId('issued_by')->nullable()->constrained('users')->restrictOnDelete();
            $t->string('status', 16)->default('DRAFT');
            $t->timestamps();
            $t->unique(['institution_id', 'document_number']);
        });
        Schema::create('communications', function (Blueprint $t) {
            $t->id();
            $t->foreignId('institution_id')->constrained()->restrictOnDelete();
            $t->string('title', 180);
            $t->text('body');
            $t->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $t->string('status', 16)->default('DRAFT');
            $t->timestamp('published_at')->nullable();
            $t->timestamps();
        });
        Schema::create('communication_targets', function (Blueprint $t) {
            $t->id();
            $t->foreignId('institution_id')->constrained()->restrictOnDelete();
            $t->foreignId('communication_id')->constrained()->restrictOnDelete();
            $t->string('kind', 20);
            $t->string('target', 60);
            $t->unique(['communication_id', 'kind', 'target'], 'communication_target_unique');
        });
        Schema::create('notifications', function (Blueprint $t) {
            $t->uuid('id')->primary();
            $t->foreignId('institution_id')->constrained()->restrictOnDelete();
            $t->string('type');
            $t->morphs('notifiable');
            $t->text('data');
            $t->timestamp('read_at')->nullable();
            $t->timestamps();
            $t->index(['institution_id', 'notifiable_id', 'read_at'], 'institution_notification_unread');
        });
    }

    public function down(): void
    {
        foreach (['notifications', 'communication_targets', 'communications', 'academic_documents', 'request_status_history', 'academic_requests', 'request_types'] as $table) {
            Schema::dropIfExists($table);
        }
    }
};
