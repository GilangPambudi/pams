<?php

namespace App\Http\Controllers;

use App\Http\Requests\Settings\StorePaymentRequest;
use App\Http\Requests\Settings\UpdatePaymentRequest;
use App\Models\Payment;
use App\Models\Property;
use App\Models\Tenancy;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $q       = (string) $request->query('q', '');
        $perPage = (int) $request->integer('per_page', 10);
        $sort    = $request->query('sort', 'created_at');
        $dir     = $request->query('dir', 'desc');
        $propertyId = $request->query('property_id');

        $sortable = ['id', 'payment_date', 'amount', 'payment_type', 'created_at'];
        if (!in_array($sort, $sortable, true)) $sort = 'created_at';
        $dir = strtolower($dir) === 'asc' ? 'asc' : 'desc';

        $payments = Payment::query()
            ->with(['tenancy.tenant', 'tenancy.property'])
            ->when($q !== '', fn($qb) => $qb->whereHas('tenancy.tenant', fn($qbt) => $qbt->where('full_name', 'like', "%{$q}%"))
                                            ->orWhereHas('tenancy.property', fn($qbp) => $qbp->where('name', 'like', "%{$q}%")))
            ->when($propertyId, fn($qb) => $qb->whereHas('tenancy', fn($qbt) => $qbt->where('property_id', $propertyId)))
            ->orderBy($sort, $dir)
            ->paginate($perPage)
            ->withQueryString();

        $properties = Property::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('payments/index', [
            'payments' => $payments,
            'properties' => $properties,
            'filters'  => ['q' => $q, 'per_page' => $perPage, 'sort' => $sort, 'dir' => $dir, 'property_id' => $propertyId],
        ]);
    }

    public function store(StorePaymentRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $payment = Payment::create($request->validated());

            $tenancy = $payment->tenancy;
            $paidForMonths = (int) $request->input('paid_for_months', 1);
            $newValidUntil = $payment->payment_date->addMonths($paidForMonths);

            $tenancy->update([
                'valid_until' => $newValidUntil,
                'paid_for_months' => $paidForMonths,
            ]);
        });

        return back()->with('success', 'Payment recorded successfully.');
    }

    public function update(UpdatePaymentRequest $request, Payment $payment): RedirectResponse
    {
        $payment->update($request->validated());

        return back()->with('success', 'Payment updated successfully.');
    }

    public function destroy(Payment $payment): RedirectResponse
    {
        $payment->delete();

        return back()->with('success', 'Payment voided successfully.');
    }
}
