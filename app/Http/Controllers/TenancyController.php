<?php

namespace App\Http\Controllers;

use App\Http\Requests\Settings\StoreTenancyRequest;
use App\Http\Requests\Settings\UpdateTenancyRequest;
use App\Models\Payment;
use App\Models\Property;
use App\Models\Tenancy;
use App\Models\Tenant;
use App\Services\TenancyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TenancyController extends Controller
{
    protected $tenancyService;

    public function __construct(TenancyService $tenancyService)
    {
        $this->tenancyService = $tenancyService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $q       = (string) $request->query('q', '');
        $perPage = (int) $request->integer('per_page', 10);
        $sort    = $request->query('sort', 'start_date');
        $dir     = $request->query('dir', 'desc');
        $propertyId = $request->query('property_id');
        $status = $request->query('status');

        $sortable = ['id', 'start_date', 'rent_price', 'status'];
        if (!in_array($sort, $sortable, true)) $sort = 'start_date';
        $dir = strtolower($dir) === 'asc' ? 'asc' : 'desc';

        $tenancies = Tenancy::query()
            ->with(['tenant', 'property'])
            ->when($q !== '', fn($qb) => $qb->whereHas('tenant', fn($qbt) => $qbt->where('full_name', 'like', "%{$q}%"))
                                            ->orWhereHas('property', fn($qbp) => $qbp->where('name', 'like', "%{$q}%")))
            ->when($propertyId, fn($qb) => $qb->where('property_id', $propertyId))
            ->when($status, fn($qb) => $qb->where('status', $status))
            ->orderBy($sort, $dir)
            ->paginate($perPage)
            ->withQueryString();

        $properties = Property::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('tenancies/index', [
            'tenancies' => $tenancies,
            'filters'   => ['q' => $q, 'per_page' => $perPage, 'sort' => $sort, 'dir' => $dir, 'property_id' => $propertyId, 'status' => $status],
            'properties' => $properties,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $propertyId = $request->query('property_id');
        $properties = Property::select('id', 'name', 'standard_monthly_rate')->get();
        // Tenants will be loaded via AJAX
        
        return Inertia::render('tenancies/create', [
            'properties' => $properties,
            'preselected_property_id' => $propertyId,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTenancyRequest $request): RedirectResponse
    {
        $this->tenancyService->createTenancy($request->validated());

        return redirect()->route('properties.edit', $request->property_id)
            ->with('success', 'Check-in successful!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tenancy $tenancy)
    {
        $tenancy->load(['tenant', 'property', 'payments' => function ($query) {
            $query->orderBy('payment_date', 'desc');
        }]);

        $properties = Property::select('id', 'name', 'standard_monthly_rate')->get();

        return Inertia::render('tenancies/edit', [
            'tenancy' => $tenancy,
            'properties' => $properties,
        ]);
    }

    public function update(UpdateTenancyRequest $request, Tenancy $tenancy): RedirectResponse
    {
        $this->tenancyService->updateTenancy($tenancy, $request->validated());

        return redirect()->route('tenancies.edit', $tenancy)
            ->with('success', 'Tenancy updated successfully!');
    }

    public function destroy(Tenancy $tenancy): RedirectResponse
    {
        // 
    }

    /**
     * Search resources for AJAX.
     */
    public function search(Request $request)
    {
        $query = $request->query('query');
        $id = $request->query('id');
        $limit = $request->query('limit', 20);

        $tenancies = Tenancy::query()
            ->with(['tenant', 'property'])
            ->where('status', 'active')
            ->when($id, fn($qb) => $qb->where('id', $id))
            ->when($query && !$id, fn($qb) => $qb->whereHas('tenant', fn($qbt) => $qbt->where('full_name', 'like', "%{$query}%"))
                                            ->orWhereHas('property', fn($qbp) => $qbp->where('name', 'like', "%{$query}%")))
            ->orderBy(Tenant::select('full_name')->whereColumn('tenants.id', 'tenancies.tenant_id'))
            ->limit($limit)
            ->get();

        return response()->json($tenancies->map(fn($t) => [
            'value' => (string) $t->id,
            'label' => $t->tenant->full_name . ' - ' . $t->property->name,
            'rent_price' => $t->rent_price,
        ]));
    }
}
