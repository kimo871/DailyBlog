<?php

return [
    'default' => 'default',
    'documentations' => [
        'default' => [
            'api' => [
                'title' => 'Scribble API',
                'version' => '1.0.0',
                'description' => 'API Documentation',
            ],
            'routes' => [
                'api' => 'docs',
                'docs' => 'docs1',
                'assets' => 'swagger-assets',
            ],
            'paths' => [
                'annotations' => [base_path('app')],
                'docs' => storage_path('api-docs'),
                'docs_json' => 'api-docs.json',
                'docs_yaml' => 'api-docs.yaml',
                'views' => base_path('resources/views/vendor/l5-swagger'),
                'base' => base_path(),
            ],
            'scanOptions' => [
                'exclude' => [
                    'app/Http/Middleware/',
                    'app/Console/',
                    'app/Exceptions/',
                ],
            ],
        ],
    ],
    'constants' => [
        'L5_SWAGGER_CONST_HOST' => env('APP_URL', 'http://localhost:8000'),
    ],
];