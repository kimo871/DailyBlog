<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(remove: [
            \Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (
            \Illuminate\Validation\ValidationException $e,
            $request
        ) {
            return response()->json([
                'status' => 'error',
                'errors' => $e->errors(),
            ], 422);
        });

        $exceptions->render(function (
            \Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException $e,
            $request
        ) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 401);
        });
    })
    ->create();
