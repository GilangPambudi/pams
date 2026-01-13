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
        'valid_until',
        'paid_for_months',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'valid_until' => 'date',
        'rent_price' => 'decimal:2',
    ];

    protected $appends = ['is_overdue'];

    public function getIsOverdueAttribute(): bool
    {
        if ($this->status !== 'active') {
            return false;
        }

        if (!$this->valid_until) {
            return $this->start_date->lt(now());
        }

        return $this->valid_until->lt(now());
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
