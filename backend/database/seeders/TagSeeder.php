<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag;

class TagSeeder extends Seeder
{
         public function run(): void
    {
        $tags = [
            'News', 'Opinion', 'Featured', 'Trending', 'Updates', 'Editorial', 'Announcement',
            'Lifestyle', 'Health', 'Fitness', 'Wellness', 'Travel', 'Food', 'Fashion', 'Beauty',
            'Business', 'Entrepreneurship', 'Startups', 'Marketing', 'Finance', 'Investing', 'Economy',
            'Technology', 'AI', 'Software', 'Gadgets', 'Internet', 'Cybersecurity',
            'Education', 'Learning', 'Career', 'Productivity', 'Self Improvement',
            'Culture', 'Society', 'Entertainment', 'Movies', 'Music', 'Books',
            'Tips', 'Guides', 'How To', 'Reviews', 'Interviews', 'Case Study',
        ];

        foreach ($tags as $tagName) {
            Tag::firstOrCreate(
                ['name' => $tagName],
                ['slug' => null] 
            );
        }
    }
}
