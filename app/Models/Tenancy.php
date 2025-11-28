<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tenancy extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'tenant_id',
        'property_id',
        'room_number',
        'start_date',
        'end_date',
        'rent_price',
        'status',
        'leaving_reason',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'rent_price' => 'decimal:2',
    ];

    protected $appends = ['is_overdue'];

    public function getIsOverdueAttribute(): bool
    {
        if ($this->status !== 'active') {
            return false;
        }

        $lastPayment = $this->payments()->latest('payment_date')->first();

        if (!$lastPayment) {
            // If no payment, check if start date is more than 1 month ago?
            // Or just check if start date is past due?
            // Let's assume if no payment, it's overdue if start_date is < today
            return $this->start_date->lt(now());
        }

        // Next due date is 1 month after last payment
        $nextDueDate = $lastPayment->payment_date->addMonth();

        return $nextDueDate->lt(now());
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
