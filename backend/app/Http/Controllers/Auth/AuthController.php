<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }
// ***************************** Register *****************************
    public function register(RegisterRequest $request): JsonResponse
    {
        try{
            $result = $this->authService->register(
            $request->validated(),
            $request->file('image')
        );

        // Get TTL from JWT config
        $ttl = config('jwt.ttl') * 60; // Convert minutes to seconds

        return response()->json([
            'status' => 'success',
            'message' => 'User created successfully',
            'user' => $result['user'],
            'authorization' => [
                'token' => $result['token'],
                'type' => 'bearer',
                'expires_in' => $ttl
            ]
        ], 201);
        }
        catch (Throwable $e) {
        // any error exception will be catched here
        $status = match(true) {
            $e instanceof AuthenticationException => 401,
            $e instanceof ValidationException => 422,
            $e instanceof HttpException => $e->getStatusCode(),
            default => 500,
        };
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'data' => null,
        ], $status);
    }
    }

// ***************************** Login *****************************
   public function login(LoginRequest $request): JsonResponse
{
    try {
        $result = $this->authService->login($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'data' => $result,
        ]);

    } catch (Throwable $e) {
        // any error exception will be catched here
        $status = match(true) {
            $e instanceof AuthenticationException => 401,
            $e instanceof ValidationException => 422,
            $e instanceof HttpException => $e->getStatusCode(),
            default => 500,
        };
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'data' => null,
        ], $status);
    }
}

// ***************************** Logout *****************************
    public function logout(): JsonResponse
    {
        $this->authService->logout();

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }
// ***************************** Me Endpoint *****************************
    public function me(): JsonResponse
    {
        $user = $this->authService->getCurrentUser();

        return response()->json([
            'status' => 'success',
            'user' => $user,
        ]);
    }
// ***************************** Update Profile *****************************
    public function updateProfile(RegisterRequest $request): JsonResponse
    {
        $user = $this->authService->getCurrentUser();
        
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not authenticated',
            ], 401);
        }

        $updatedUser = $this->authService->updateProfile(
            $user,
            $request->validated(),
            $request->file('image')
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'user' => $updatedUser,
        ]);
    }
};