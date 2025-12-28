<?php

namespace App\Http\Requests\Comments;
/**
 * @OA\Schema(
 *     schema="UpdateCommentRequest",
 *     @OA\Property(property="body", type="string", example="This is the comment"),
 * )
 */
class UpdateCommentRequest extends CreateCommentRequest
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
