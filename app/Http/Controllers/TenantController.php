<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tenant;
use Inertia\Inertia;
use App\Http\Requests\Settings\StoreTenantRequest;
use App\Http\Requests\Settings\UpdateTenantRequest;
use Illuminate\Http\RedirectResponse;

class TenantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $q       = (string) $request->query('q', '');
        $perPage = (int) $request->integer('per_page', 10);
        $sort    = $request->query('sort', 'full_name');
        $dir     = $request->query('dir', 'asc');

        $sortable = ['id', 'full_name', 'updated_at'];
        if (!in_array($sort, $sortable, true)) $sort = 'full_name';
        $dir = strtolower($dir) === 'desc' ? 'desc' : 'asc';

        $tenants = Tenant::query()
            ->when($q !== '', fn($qb) => $qb->where('full_name', 'like', "%{$q}%"))
            ->orderBy($sort, $dir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('tenants/index', [
            'tenants' => $tenants,
            'filters'   => ['q' => $q, 'per_page' => $perPage, 'sort' => $sort, 'dir' => $dir],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('tenants/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTenantRequest $request): RedirectResponse
    {
        Tenant::create($request->validated());

        return redirect()->route('tenants.index')->with('success', 'Tenant created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tenant $tenant)
    {
        return Inertia::render('tenants/edit', [
            'tenant' => $tenant->only(['id', 'full_name', 'gender', 'date_of_birth', 'origin_city', 'occupation', 'workplace_name', 'phone_number']),
            'can_delete' => !$tenant->tenancies()->where('status', 'active')->exists(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTenantRequest $request, Tenant $tenant): RedirectResponse
    {
        $tenant->update($request->validated());

        return redirect()->route('tenants.index')->with('success', 'Tenant updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tenant $tenant): RedirectResponse
    {
        if ($tenant->tenancies()->where('status', 'active')->exists()) {
            return redirect()->back()->with('error', 'Cannot delete tenant with active tenancy.');
        }

        $tenant->delete();

        return redirect()->route('tenants.index')->with('success', 'Tenant deleted successfully.');
    }

    /**
     * Search resources for AJAX.
     */
    public function search(Request $request)
    {
        $query = $request->query('query');
        $limit = $request->query('limit', 20);

        $tenants = Tenant::query()
            ->when($query, fn($q) => $q->where('full_name', 'like', "%{$query}%"))
            ->whereDoesntHave('tenancies', fn($q) => $q->where('status', 'active'))
            ->orderBy('full_name')
            ->limit($limit)
            ->get(['id', 'full_name', 'origin_city']);

        return response()->json($tenants->map(fn($t) => [
            'value' => (string) $t->id,
            'label' => $t->full_name . ($t->origin_city ? " ({$t->origin_city})" : ''),
        ]));
    }
}
