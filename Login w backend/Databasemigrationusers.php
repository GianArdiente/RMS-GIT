<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: create_users_table
 * ─────────────────────────────
 * Standard Laravel users table extended with:
 *   - `role`       : enum — admin | technician | staff
 *   - `created_by` : FK to the admin user who created this account
 *   - `is_active`  : soft-disable without deleting
 *
 * Accounts are created exclusively by an Admin (no public registration).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // ── Basic info ──────────────────────────────────────────────
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();

            // ── Role & account management ───────────────────────────────
            $table->enum('role', ['admin', 'technician', 'staff'])
                  ->default('staff')
                  ->comment('Determines dashboard access. Set by admin on account creation.');

            $table->boolean('is_active')
                  ->default(true)
                  ->comment('Inactive accounts cannot log in.');

            // Nullable so the first admin account has no creator.
            $table->foreignId('created_by')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete()
                  ->comment('Admin user who created this account.');

            $table->timestamps();
            $table->softDeletes(); // Allows safe deletion without losing audit trail
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};