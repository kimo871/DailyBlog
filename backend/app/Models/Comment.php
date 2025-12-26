<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\User;
use App\Models\Post;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'body',
        'user_id',
        'post_id',
    ];
    // define relations with users and posts
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    // eager loaded relations
    public function ScopeLoadWithUser($query)
    {
        return $query->with('user:id,name,image');
    }

    public function ScopeLoadRecent($query, $limit = 20)
    {
        return $query->latest()->limit($limit);
    }


    public function belongsToUser(int $userId): bool
    {
        return $this->user_id === $userId;
    }

    public function canBeManagedBy(int $userId): bool
    {
        return $this->belongsToUser($userId)
            || $this->post?->user_id === $userId;
    }
}
