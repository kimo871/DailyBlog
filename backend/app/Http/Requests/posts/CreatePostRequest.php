<?php

namespace App\Http\Requests\Posts;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

/**
 * @OA\Schema(
 *     schema="CreatePostRequest",
 *     required={"title", "body","tags"},
 *     @OA\Property(property="title", type="string", example="My First Post"),
 *     @OA\Property(property="body", type="string", example="This is the content of my post"),
 *     @OA\Property(
 *         property="tags",
 *         type="array",
 *         @OA\Items(type="string", example="laravel"),
 *     )
 * )
 */

class CreatePostRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }
    
    public function rules(): array
    {
        $rules = [
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'tags' => 'required|array|min:1',
            'tags.*' => 'string|max:50',
        ];

        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['tags'] = 'sometimes|array|min:1';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Post title is required',
            'body.required' => 'Post content is required',
            'tags.required' => 'At least one tag is required',
            'tags.min' => 'A post must have at least one tag',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422)
        );
    }

    protected function failedAuthorization()
    {
        throw new HttpResponseException(
            response()->json([
                'status' => 'error',
                'message' => 'You are not authorized to perform this action',
            ], 403)
        );
    }
}