<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\Request;

trait HasIndexFilters
{
    protected function resolveIndexFilters(
        Request $request,
        array $config,
        array $extra = []
    ): array {
        $defaultSort = $config['default_sort'] ?? 'id';
        $defaultDir = strtolower($config['default_dir'] ?? 'asc');
        $defaultPerPage = (int) ($config['default_per_page'] ?? 10);
        $sortable = $config['sortable'] ?? [];

        $filters = [
            'q' => (string) $request->query('q', ''),
            'per_page' => (int) $request->integer('per_page', $defaultPerPage),
            'sort' => $request->query('sort', $defaultSort),
            'dir' => strtolower((string) $request->query('dir', $defaultDir)),
        ];

        if (!in_array($filters['sort'], $sortable, true)) {
            $filters['sort'] = $defaultSort;
        }

        if (!in_array($filters['dir'], ['asc', 'desc'], true)) {
            $filters['dir'] = $defaultDir;
        }

        foreach ($extra as $key) {
            $filters[$key] = $request->query($key);
        }

        return $filters;
    }
}
