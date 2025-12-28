<?php

namespace App\Http\Controllers;
/**
 * @OA\OpenApi(
 *     @OA\Info(
 *         version="1.0.0",
 *         title="Scribble API",
 *         description="API documentation for Scribble Backend"
 *     ),
 *     @OA\Server(
 *         url="http://localhost:8000",
 *         description="Local Development Server"
 *     ),
 *     @OA\Server(
 *         url="http://scribble.test",
 *         description="Development Server"
 *     ),
 *     @OA\Components(
 *         @OA\SecurityScheme(
 *             securityScheme="bearerAuth",
 *             type="http",
 *             scheme="bearer",
 *             bearerFormat="JWT"
 *         )
 *         ,
 *         @OA\Schema(
 *             schema="ErrorResponse",
 *             @OA\Property(property="status", type="string", example="error"),
 *             @OA\Property(property="message", type="string", example="An error occurred"),
 *             @OA\Property(property="errors", type="object")
 *         ),
 *         @OA\Schema(
 *             schema="SuccessResponse",
 *             @OA\Property(property="status", type="string", example="success"),
 *             @OA\Property(property="message", type="string", example="Operation successful"),
 *             @OA\Property(property="data", type="object")
 *         )
 *     )
 * )
 */
abstract class Controller
{
    //
}
