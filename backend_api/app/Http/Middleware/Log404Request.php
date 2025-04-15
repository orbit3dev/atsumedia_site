<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class Log404Request
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Proceed with the request
        $response = $next($request);

        // Check if the response status is 404
        if ($response->getStatusCode() === 404) {
            // Log the 404 request with relevant details
            Log::error('404 Not Found', [
                'method'    => $request->method(),
                'full_url'  => $request->fullUrl(),
                'uri'       => $request->path(),
                'headers'   => $request->headers->all(),
                'params'    => $request->all(),
                'ip'        => $request->ip(),
            ]);
        }

        // Return the response
        return $response;
    }
}
