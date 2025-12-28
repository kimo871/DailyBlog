<?php

namespace App\Services;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TagService
{
    public function attachTagsToPost(Post $post, array $tagNames): void
    {
        // normalize tag names by trimming and filtering 
        $tagNames = collect($tagNames)
            ->map(fn ($name) => trim($name))
            ->filter()
            ->unique()
            ->values();

        // fetch seeded ones in db
        $tags = Tag::whereIn('name', $tagNames)->get();

        // ensure provided all are in the seeded data
        if ($tags->count() !== $tagNames->count()) {
            $existingNames = $tags->pluck('name');
            $missingTags = $tagNames->diff($existingNames);

            throw new ModelNotFoundException(
                'The following tags do not exist: ' . $missingTags->implode(', ')
            );
        }

        // attach tags to post
        $post->tags()->sync($tags->pluck('id'));
    }

    public function getTags(){
        $tags = Tag::all();
    
    return $tags;
    }
}
