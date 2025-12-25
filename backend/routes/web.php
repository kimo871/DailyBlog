<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

// default healthcheck endpoint
Route::get('/', function () {
    return view('welcome');
});

// test route for db connection
Route::get('/test', function () {
    try {
        DB::connection()->getPdo();
        return response()->json([
            "message" => "Connected successfully! Database: " . DB::connection()->getDatabaseName(),
            "status" => "success"
        ]);
    } catch (\Exception $e) {
        return response()->json([
            "message" => "Connection failed: " . $e->getMessage(),
            "status" => "error"
        ], 500);
    }
});


