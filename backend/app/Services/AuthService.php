<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Auth\AuthenticationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class AuthService
{
// ===================================================================================================
    public function register(array $data, $image = null): array
    {
        try{
        // Handle image upload using Laravel Filesystem
        $imagePath = null;
        if ($image) {
            $imagePath = $image->store('users', 'public');
        }
        // Create user
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'image' => $imagePath,
        ]);
                // Generate token
        $token = JWTAuth::fromUser($user);
        return [
            'user' => $user,
            'token' => $token,
        ];
        }
        catch (\Throwable $e) {
        // Throw as a custom exception or just bubble up
        throw new HttpException('Registration failed: ' . $e->getMessage());
    }
    }
// ===================================================================================================
   public function login(array $credentials): ?array
    {
            // Try to authenticate with JWT
            if (!$token = JWTAuth::attempt($credentials)) {
                // Throw AuthenticationException instead of returning null
                throw new AuthenticationException('Invalid credentials');
            }
            // Get authenticated user
            $user = JWTAuth::user();
            return [
                'user' => $user,
                'token' => $token,
            ];
    }
// ===================================================================================================
    public function logout(): void
    {
       auth()->guard('api')->logout(); 
    }
// ===================================================================================================
    public function getCurrentUser(): ?User
    {
        return auth()->guard('api')->user();
    }
// ===================================================================================================
    public function updateProfile(User $user, array $data, $image = null): User
    {
        if (isset($data['name'])) {
            $user->name = $data['name'];
        }

        if (isset($data['email']) && $data['email'] !== $user->email) {
            $user->email = $data['email'];
        }

        if (isset($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        if ($image) {
            // Delete old image if exists
            if ($user->image) {
                Storage::disk('public')->delete($user->image);
            }
            $user->image = $image->store('users', 'public');
        }

        $user->save();
        return $user;
    }
}