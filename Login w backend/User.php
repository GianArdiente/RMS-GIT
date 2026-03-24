<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     * (created_by is set programmatically, not via form fill.)
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'created_by',
    ];

    /** @var array<string,string> */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
        'is_active'         => 'boolean',
    ];

    /** Always hide these from serialisation. */
    protected $hidden = ['password', 'remember_token'];

    // ──────────────────────────────────────────────
    // Role helpers
    // ──────────────────────────────────────────────

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isTechnician(): bool
    {
        return $this->role === 'technician';
    }

    public function isStaff(): bool
    {
        return $this->role === 'staff';
    }

    /**
     * Check if the user has any of the given roles.
     *
     * Usage: $user->hasRole('admin', 'staff')
     */
    public function hasRole(string ...$roles): bool
    {
        return in_array($this->role, $roles, strict: true);
    }

    /**
     * The named route for this user's dashboard.
     */
    public function dashboardRoute(): string
    {
        return match ($this->role) {
            'admin'      => 'admin.dashboard',
            'technician' => 'technician.dashboard',
            'staff'      => 'staff.dashboard',
            default      => 'login',
        };
    }

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    /**
     * The admin who created this account.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Accounts created by this user (admin relationship).
     */
    public function createdUsers(): HasMany
    {
        return $this->hasMany(User::class, 'created_by');
    }

    // ──────────────────────────────────────────────
    // Scopes
    // ──────────────────────────────────────────────

    public function scopeAdmins($query)      { return $query->where('role', 'admin'); }
    public function scopeTechnicians($query) { return $query->where('role', 'technician'); }
    public function scopeStaff($query)       { return $query->where('role', 'staff'); }
    public function scopeActive($query)      { return $query->where('is_active', true); }
}