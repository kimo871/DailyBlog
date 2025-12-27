<?php

namespace App\Http\Requests\Comments;

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
