<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StripEnvPrefix
{
    public function handle(Request $request, Closure $next)
    {
        if (str_starts_with($request->path(), 'main/')) {
            $newPath = preg_replace('#^main/#', '', $request->path());
            Log::info('new path');
            Log::info($newPath);
            // Clone request with new path
            $request = Request::create(
                '/' . $newPath,
                $request->method(),
                $request->all()
            );
        }

        return $next($request);
    }
}
