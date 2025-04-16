<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StripEnvPrefix
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->is('test/*')) {
            // Strip 'test/' from the start of the URI
            $newPath = preg_replace('#^test/#', '', $request->path());

            // Override the request instance
            $newRequest = Request::create("/{$newPath}", $request->method(), $request->all(), $request->cookies->all(), $request->files->all(), $request->server->all(), $request->getContent());
            Log::info($newPath);
            Log::info($newRequest);
            app()->instance('request', $newRequest);
        }

        return $next($request);
    }
}
