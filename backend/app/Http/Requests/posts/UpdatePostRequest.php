<?php

namespace App\Http\Requests\Posts;

/**
 * @OA\Schema(
 *     schema="UpdatePostRequest",
 *     @OA\Property(property="title", type="string", example="Updated Post Title"),
 *     @OA\Property(property="body", type="string", example="Updated content"),
 *     @OA\Property(
 *         property="tags",
 *         type="array",
 *         @OA\Items(type="string", example="updated")
 *     )
 * )
 */

class UpdatePostRequest extends CreatePostRequest
{
    public function rules(): array
    {
        // inherit parent rules
        $rules = parent::rules();

        foreach ($rules as $field => &$rule) {
            if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
                $rule = str_replace('required', 'sometimes', $rule);
            }
        }

        return $rules;
    }
}
