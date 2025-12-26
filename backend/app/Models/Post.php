<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use App\Models\Tag;
use App\Models\Comment;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'body',
        'author_id', 
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    // validate that post has at least one tag
    public static function boot()
    {
        parent::boot();

        static::creating(function ($post) {
            $post->expires_at = now()->addHours(24);
        });

    }

    // Relations
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function tags()
{
    return $this->belongsToMany(Tag::class, 'post_tag', 'post_id', 'tag_id');
}



    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // eager loaded relations
    public function ScopeLoadWithUser($query){
        return $query->with('author:id,name,image');
    }
    public function ScopeLoadWithComments($query){
        return $query->with('comment:id,body');
    }

}