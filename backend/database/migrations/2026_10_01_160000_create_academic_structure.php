<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('academic_years', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->restrictOnDelete();
            $table->string('name', 100);
            $table->date('start_date');
            $table->date('end_date');
            $table->string('status', 20)->default('DRAFT');
            $table->boolean('is_current')->default(false);
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['institution_id', 'name']);
            $table->unsignedBigInteger('current_institution_id')->nullable()->storedAs('CASE WHEN is_current = 1 AND deleted_at IS NULL THEN institution_id ELSE NULL END');
            $table->unique('current_institution_id');
        });
        Schema::create('academic_periods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained()->restrictOnDelete();
            $table->string('name', 100);
            $table->unsignedSmallInteger('sequence');
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('grading_open')->default(false);
            $table->string('status', 20)->default('DRAFT');
            $table->timestamps();
            $table->unique(['academic_year_id', 'sequence']);
        });
        Schema::create('education_levels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->restrictOnDelete();
            $table->string('name', 100);
            $table->string('code', 40);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->string('status', 20)->default('ACTIVE');
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['institution_id', 'name']);
            $table->unique(['institution_id', 'code']);
        });
        Schema::create('grade_levels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('education_level_id')->constrained()->restrictOnDelete();
            $table->string('name', 100);
            $table->string('code', 40);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->string('status', 20)->default('ACTIVE');
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['education_level_id', 'name']);
            $table->unique(['education_level_id', 'code']);
        });
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->restrictOnDelete();
            $table->foreignId('academic_year_id')->constrained()->restrictOnDelete();
            $table->foreignId('grade_level_id')->constrained()->restrictOnDelete();
            $table->string('name', 100);
            $table->unsignedInteger('capacity')->nullable();
            $table->string('status', 20)->default('ACTIVE');
            $table->timestamps();
            $table->unique(['institution_id', 'academic_year_id', 'grade_level_id', 'name'], 'sections_institution_year_grade_name_unique');
        });
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->restrictOnDelete();
            $table->string('name', 100);
            $table->string('code', 40);
            $table->text('description')->nullable();
            $table->string('status', 20)->default('ACTIVE');
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['institution_id', 'name']);
            $table->unique(['institution_id', 'code']);
        });
    }

    public function down(): void
    {
        foreach (['subjects', 'sections', 'grade_levels', 'education_levels', 'academic_periods', 'academic_years'] as $table) {
            Schema::dropIfExists($table);
        }
    }
};
