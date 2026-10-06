<?php

namespace App\Http\Resources;

use App\Models\Learning\Assessment;
use App\Models\Learning\Assignment;
use App\Models\Learning\Score;
use App\Models\Learning\Submission;
use App\Services\Learning\LearningAccess;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LearningResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $r = $this->resource;
        $data = $r->attributesToArray();
        $access = app(LearningAccess::class);
        $course = $access->course($r);
        $data['course'] = $course ? ['id' => $course->id, 'name' => $course->name] : null;
        $data['abilities'] = [];
        foreach (match (true) {
            $r instanceof Submission => ['update', 'review'], $r instanceof Score => ['update'], $r instanceof Assignment => ['update', 'publish', 'close', 'submit'], default => ['update', 'publish', 'close']
        } as $ability) {
            $data['abilities'][$ability] = $request->user()->can($ability, $r);
        }
        if ($r instanceof Submission || $r instanceof Score) {
            $data['student'] = ['id' => $r->student_id, 'name' => trim(($r->student?->user?->first_name ?? '').' '.($r->student?->user?->last_name ?? ''))];
        }
        if ($r instanceof Submission) {
            $data['assignment'] = ['id' => $r->assignment_id, 'title' => $r->assignment?->title];
        }
        $assessment = $r instanceof Score ? $r->assessment : ($r instanceof Assessment ? $r : null);
        if ($assessment) {
            $data['period'] = ['id' => $assessment->academic_period_id, 'name' => $assessment->period?->name, 'grading_open' => $assessment->period?->grading_open];
            if ($r instanceof Score) {
                $data['assessment'] = ['id' => $assessment->id, 'title' => $assessment->title];
            }
        }
        if ($r instanceof Assignment) {
            $data['unit_title'] = $r->unit?->title;
        }

        return $data;
    }
}
