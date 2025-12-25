<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class Handler extends ExceptionHandler
{
    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->renderable(function (Throwable $e, $request) {
            // Always return JSON for API requests
            if ($request->is('api/*') || $request->expectsJson()) {
                return $this->handleApiException($e, $request);
            }
        });
    }

    /**
     * Handle API exceptions
     */
    protected function handleApiException(Throwable $e, $request)
    {
        $statusCode = $this->getStatusCode($e);
        $response = [
            'status' => 'error',
            'message' => $this->getErrorMessage($e, $statusCode),
        ];

        // Add validation errors if available
        if ($e instanceof ValidationException) {
            $response['errors'] = $e->errors();
        }

        // Add debug info in local environment
        if (config('app.debug')) {
            $response['debug'] = [
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTrace(),
            ];
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Get HTTP status code from exception
     */
    protected function getStatusCode(Throwable $e): int
    {
        if ($e instanceof HttpException) {
            return $e->getStatusCode();
        }

        if ($e instanceof AuthenticationException) {
            return 401;
        }

        if ($e instanceof ValidationException) {
            return 422;
        }

        // Default to 500 for internal errors
        return 500;
    }

    /**
     * Get user-friendly error message
     */
    protected function getErrorMessage(Throwable $e, int $statusCode): string
    {
        // Custom messages based on status code
        $messages = [
            400 => 'Bad Request',
            401 => 'Unauthorized',
            403 => 'Forbidden',
            404 => 'Resource Not Found',
            405 => 'Method Not Allowed',
            419 => 'Session Expired',
            422 => 'Validation Failed',
            429 => 'Too Many Requests',
            500 => 'Internal Server Error',
            503 => 'Service Unavailable',
        ];

        // Return custom message or exception message
        return $messages[$statusCode] ?? $e->getMessage() ?? 'An error occurred';
    }

    protected function unauthenticated($request, AuthenticationException $exception)
{
    if ($request->is('api/*') || $request->expectsJson()) {
        return response()->json([
            'status' => 'error',
            'message' => 'Unauthorized',  // custom message
            'data' => null
        ], 401);
    }

    return redirect()->guest(route('login'));
}
}