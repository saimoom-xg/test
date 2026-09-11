<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckMaintenanceMode
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $maintenanceActive = (bool) Setting::get('system.maintenance_mode', false);

        if (! $maintenanceActive) {
            return $next($request);
        }

        // Whitelisted route patterns
        if (
            $request->is('admin*') ||
            $request->is('login*') ||
            $request->is('logout*') ||
            $request->is('settings*') ||
            $request->is('up')
        ) {
            return $next($request);
        }

        // Check if user is authenticated admin
        if ($request->user() && method_exists($request->user(), 'hasRole') && $request->user()->hasRole('admin')) {
            return $next($request);
        }

        $bypassKey = (string) Setting::get('system.maintenance_bypass_key', '');

        // Secret URL parameter bypass e.g. ?bypass=storehub-preview-secret
        if ($bypassKey !== '' && $request->query('bypass') === $bypassKey) {
            $response = $next($request);
            $response->headers->setCookie(cookie()->make('maintenance_bypass', $bypassKey, 60 * 24));

            return $response;
        }

        // Cookie check
        if ($bypassKey !== '' && $request->cookie('maintenance_bypass') === $bypassKey) {
            return $next($request);
        }

        $title = Setting::get('system.maintenance_title', 'Under Maintenance');
        $message = Setting::get('system.maintenance_message', 'Our store is currently undergoing scheduled maintenance. Please check back shortly.');
        $siteTitle = Setting::get('general.site_title', config('app.name', 'StoreHub'));
        $siteLogo = Setting::get('general.site_logo');
        $logoHtml = $siteLogo ? '<img src="'.htmlspecialchars((string) $siteLogo).'" alt="'.htmlspecialchars((string) $siteTitle).'" style="max-height: 56px; max-width: 180px; object-fit: contain; margin: 0 auto 22px auto; display: block;">' : '';

        $html = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$title} - {$siteTitle}</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #18181b 0%, #09090b 100%);
            color: #f4f4f5;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }
        .card {
            background: rgba(39, 39, 42, 0.65);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 28px;
            max-width: 540px;
            width: 100%;
            padding: 48px 36px;
            text-align: center;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            border-radius: 9999px;
            background: rgba(234, 179, 8, 0.15);
            border: 1px solid rgba(234, 179, 8, 0.3);
            color: #facc15;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 24px;
        }
        .badge-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #facc15;
            box-shadow: 0 0 10px #facc15;
        }
        h1 {
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.02em;
            margin-bottom: 16px;
            color: #ffffff;
        }
        p {
            font-size: 15px;
            line-height: 1.6;
            color: #a1a1aa;
            margin-bottom: 32px;
        }
        .admin-link {
            display: inline-block;
            color: #71717a;
            font-size: 13px;
            text-decoration: none;
            transition: color 0.2s;
        }
        .admin-link:hover { color: #facc15; }
    </style>
</head>
<body>
    <div class="card">
        {$logoHtml}
        <div class="badge">
            <span class="badge-dot"></span>
            Maintenance Mode Active
        </div>
        <h1>{$title}</h1>
        <p>{$message}</p>
        <div>
            <a href="/login" class="admin-link">Store Administrator Login &rarr;</a>
        </div>
    </div>
</body>
</html>
HTML;

        return response($html, 503)->header('Retry-After', '3600');
    }
}
