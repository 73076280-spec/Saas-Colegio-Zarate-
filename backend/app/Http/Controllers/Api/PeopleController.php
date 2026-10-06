<?php

namespace App\Http\Controllers\Api;

use App\Enums\RoleName;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\People\PersonListRequest;
use App\Http\Requests\People\SavePersonRequest;
use App\Http\Resources\PersonResource;
use App\Models\User;
use App\Services\People\PeopleCatalog;
use App\Services\People\PersonService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PeopleController extends Controller
{
    public function index(PersonListRequest $request)
    {
        $type = $request->route('people');
        $filters = $request->validated();
        $query = PeopleCatalog::model($type)::with('user');
        if ($type === 'guardians') {
            $query->withCount('students');
        }
        if (! empty($filters['search'])) {
            $search = '%'.addcslashes($filters['search'], '%_\\').'%';
            $query->where(function ($q) use ($search, $type) {
                $q->where('document_number', 'like', $search)->orWhereHas('user', fn ($u) => $u->where('first_name', 'like', $search)->orWhere('last_name', 'like', $search)->orWhereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", [$search]));
                if ($type !== 'guardians') {
                    $q->orWhere($type === 'students' ? 'student_code' : 'teacher_code', 'like', $search);
                }
            });
        }
        foreach (array_intersect(['status', 'document_number', 'student_code', 'teacher_code'], array_merge(PeopleCatalog::fields($type), ['status'])) as $field) {
            if (! empty($filters[$field])) {
                $query->where($field, $filters[$field]);
            }
        }

        return PersonResource::collection($query->orderByDesc('id')->paginate($filters['per_page'] ?? 15)->withQueryString());
    }

    public function show(Request $request)
    {
        $person = PeopleCatalog::model($request->route('people'))::with('user')->findOrFail($request->route('person'));
        Gate::authorize('view', $person);
        if ($request->route('people') === 'guardians') {
            $person->loadCount('students');
        }

        return new PersonResource($person);
    }

    public function store(SavePersonRequest $request, PersonService $service)
    {
        return (new PersonResource($service->save($request->route('people'), $request->validated(), $request)))->response()->setStatusCode(201);
    }

    public function update(SavePersonRequest $request, PersonService $service)
    {
        return new PersonResource($service->save($request->route('people'), $request->validated(), $request, $request->person(), $request->route('operation') === 'disable'));
    }

    public function accounts(PersonListRequest $request)
    {
        $type = $request->route('people');
        $filters = $request->validated();
        $profileTable = (new (PeopleCatalog::model($type)))->getTable();
        $query = User::select(['id', 'first_name', 'last_name', 'email'])->where('status', UserStatus::ACTIVE)
            ->role(PeopleCatalog::role($type)->value)
            ->whereDoesntHave('roles', fn ($q) => $q->whereNotIn('name', [RoleName::STUDENT->value, RoleName::TEACHER->value, RoleName::GUARDIAN->value]))
            ->whereNotIn('id', PeopleCatalog::model($type)::withTrashed()->select($profileTable.'.user_id'));
        if (! empty($filters['search'])) {
            $search = '%'.addcslashes($filters['search'], '%_\\').'%';
            $query->where(fn ($q) => $q->where('first_name', 'like', $search)->orWhere('last_name', 'like', $search)->orWhere('email', 'like', $search));
        }

        return $query->orderBy('id')->paginate($filters['per_page'] ?? 15);
    }
}
