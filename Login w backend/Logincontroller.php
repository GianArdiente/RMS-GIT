<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class LoginController extends Controller
{
    /**
     * Show the login form.
     */
    public function showLoginForm(): View
    {
        return view('auth.login');
    }

    /**
     * Handle an incoming authentication request.
     *
     * After credentials are validated, the user's role (stored in the `role`
     * column on the `users` table) determines the redirect destination —
     * NOT the role the user typed on the form. The form role tab is only a
     * UI hint; the actual role is always read from the database record.
     */
    public function login(LoginRequest $request): RedirectResponse
    {
        // Attempt to authenticate with email + password only.
        // Rate-limiting and throttle headers are handled by LoginRequest.
        $request->authenticate();

        // Regenerate session to prevent fixation attacks.
        $request->session()->regenerate();

        $user = Auth::user();

        // Role-based redirect — extend this match as you add more roles.
        return match ($user->role) {
            'admin'       => redirect()->intended(route('admin.dashboard')),
            'technician'  => redirect()->intended(route('technician.dashboard')),
            'staff'       => redirect()->intended(route('staff.dashboard')),

            // Safety fallback: log out and reject unknown roles.
            default => $this->rejectUnknownRole($request),
        };
    }

    /**
     * Destroy the authenticated session (logout).
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    // ──────────────────────────────────────────────
    // Private helpers
    // ──────────────────────────────────────────────

    /**
     * Log out a user whose role is not recognised and redirect them back
     * with a descriptive error message.
     */
    private function rejectUnknownRole(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()
            ->route('login')
            ->withErrors(['email' => 'Your account does not have an assigned role. Please contact the administrator.']);
    }
}