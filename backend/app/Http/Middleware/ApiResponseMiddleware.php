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
        if (!isset($data['status']) || $data['status'] === 'success') {
            $payload = $data;
            unset($payload['status'], $payload['message']);

            return response()->json([
                'status' => 'success',
                'message' => $data['message'] ?? 'OK',
                'data' => $payload,
            ], $response->status());
        }
    }

    return $response;
}
}
