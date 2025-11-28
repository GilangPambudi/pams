<?php

namespace App\Http\Controllers;

use App\Http\Requests\Settings\StorePropertyRequest;
use App\Http\Requests\Settings\UpdatePropertyRequest;
use App\Models\Property;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $q       = (string) $request->query('q', '');
        $perPage = (int) $request->integer('per_page', 10);
        $sort    = $request->query('sort', 'name');
        $dir     = $request->query('dir', 'asc');

        $sortable = ['id', 'name', 'updated_at'];
        if (!in_array($sort, $sortable, true)) $sort = 'name';
        $dir = strtolower($dir) === 'desc' ? 'desc' : 'asc';

        $properties = Property::query()
            ->when($q !== '', fn($qb) => $qb->where('name', 'like', "%{$q}%"))
            ->orderBy($sort, $dir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('properties/index', [
            'properties' => $properties,
            'filters'   => ['q' => $q, 'per_page' => $perPage, 'sort' => $sort, 'dir' => $dir],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('properties/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePropertyRequest $request): RedirectResponse
    {
        Property::create($request->validated());

        return redirect()->route('properties.index')->with('success', 'Property created successfully.');
    }



    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Property $property)
    {
        $property->load(['tenancies' => function ($query) {
            $query->where('status', 'active')->with('tenant');
        }]);

        return Inertia::render('properties/edit', [
            'property' => $property,
            'can_delete' => !$property->activeTenants()->exists(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePropertyRequest $request, Property $property): RedirectResponse
    {
        $property->update($request->validated());

        return redirect()->route('properties.index')->with('success', 'Property updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Property $property): RedirectResponse
    {
        if ($property->activeTenants()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete property with active tenants.');
        }

        $property->delete();

        return redirect()->route('properties.index')->with('success', 'Property deleted successfully.');
    }
}
