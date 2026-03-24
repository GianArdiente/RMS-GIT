<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * RoleMiddleware
 * ──────────────
 * Protects routes by checking the authenticated user's `role` column
 * against the roles specified in the route definition.
 *
 * Usage in routes/auth.php:
 *   Route::middleware(['auth', 'role:admin'])   → admin only
 *   Route::middleware(['auth', 'role:admin,staff']) → admin OR staff
 */
class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = Auth::user();

        // Should not happen if 'auth' middleware runs first, but guard anyway.
        if (! $user) {
            return redirect()->route('login');
        }

        // Allow if the user's role matches any of the allowed roles.
        if (in_array($user->role, $roles, strict: true)) {
            return $next($request);
        }

        // Role mismatch — redirect to the correct dashboard with an error.
        return $this->redirectToOwnDashboard($user->role);
    }

    /**
     * Send the user to their actual dashboard when they try to access
     * a dashboard that belongs to a different role.
     */
    private function redirectToOwnDashboard(string $role): Response
    {
        $map = [
            'admin'      => 'admin.dashboard',
            'technician' => 'technician.dashboard',
            'staff'      => 'staff.dashboard',
        ];

        $route = $map[$role] ?? 'login';

        return redirect()
            ->route($route)
            ->with('error', 'You do not have permission to access that area.');
    }
}