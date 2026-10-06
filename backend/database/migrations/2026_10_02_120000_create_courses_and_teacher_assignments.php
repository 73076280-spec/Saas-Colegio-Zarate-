<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['teacher_assignments', 'courses'] as $name) {
            Schema::create($name, function (Blueprint $t) use ($name) {
                $t->id();
                $t->foreignId('institution_id')->constrained()->restrictOnDelete();
                foreach (['academic_year', 'teacher', 'subject', 'grade_level', 'section'] as $parent) {
                    $t->foreignId($parent.'_id')->constrained()->restrictOnDelete();
                }
                if ($name === 'courses') {
                    $t->foreignId('teacher_assignment_id')->nullable()->constrained()->restrictOnDelete();
                    $t->string('name', 150);
                    $t->string('code', 60);
                    $t->text('description')->nullable();
                    $t->string('status', 20)->default('DRAFT');
                    $t->softDeletes();
                    $t->unique(['institution_id', 'academic_year_id', 'code'], 'courses_code_unique');
                } else {
                    $t->string('status', 20)->default('ACTIVE');
                }
                $t->timestamps();
                // Multiple teachers may teach one subject/section; the teacher is part of equivalence.
                $t->unique(['institution_id', 'academic_year_id', 'subject_id', 'grade_level_id', 'section_id', 'teacher_id'], $name.'_equivalent_unique');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
        Schema::dropIfExists('teacher_assignments');
    }
};
