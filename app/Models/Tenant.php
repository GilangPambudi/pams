<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tenant extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'tenants';
    protected $fillable = [
        'full_name',
        'gender',
        'date_of_birth',
        'origin_city',
        'occupation',
        'workplace_name',
        'phone_number',
    ];
    protected $casts = [
        'date_of_birth' => 'date',
    ];
    public function leases(): HasMany
    {
        return $this->hasMany(LeaseAgreement::class, 'tenant_id', 'tenant_id');
    }
    public function tenancies(): HasMany
    {
        return $this->hasMany(Tenancy::class);
    }
}
