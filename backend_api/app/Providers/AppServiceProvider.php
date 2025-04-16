<?php

namespace App\Providers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        URL::forceRootUrl(config('app.url'));
    	if (Request::is('test/*')) {
        $path = preg_replace('#^test/#', '', Request::path());
Log::info($path);
        app()->instance('request', Request::create("/{$path}", Request::method(), Request::all()));
    	}
        // Optional: if using HTTPS
        // URL::forceScheme('https');
    }
}
