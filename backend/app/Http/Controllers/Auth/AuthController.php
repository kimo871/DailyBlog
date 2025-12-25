<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(RegisterRequest $request): JsonResponse
    {
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

   public function login(LoginRequest $request): JsonResponse
    {
            $data = $request->validated();
            $result = $this->authService->login($request->validated());

            $ttl = config('jwt.ttl') * 60;

            return response()->json([
                'status' => 'success',
                'message' => 'Login successful',
                'user' => $result['user'],
                'authorization' => [
                    'token' => $result['token'],
                    'type' => 'bearer',
                    'expires_in' => $ttl
                ]
            ]);
    }

    public function logout(): JsonResponse
    {
        $this->authService->logout();

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }

    public function me(): JsonResponse
    {
        $user = $this->authService->getCurrentUser();

        return response()->json([
            'status' => 'success',
            'user' => $user,
        ]);
    }

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