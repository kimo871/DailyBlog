<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;

// used as response interceptor for consistent response structure
class ApiResponseMiddleware
{
    public function handle($request, Closure $next)
{
    $response = $next($request);

    if ($response instanceof JsonResponse) {
    $data = $response->getData(true);

    // Only wrap if 'status' key is missing
    if (!isset($data['status'])) {
        return response()->json([
            'status' => 'success',
            'message' => $data['message'] ?? 'OK',
            'data' => $data,
        ], $response->status());
    }
}

    return $response;
}
}
