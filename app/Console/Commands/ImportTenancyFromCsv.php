<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\SimpleExcel\SimpleExcelReader;
use App\Models\Property;
use App\Services\TenancyService;

class ImportTenancyFromCsv extends Command
{
    protected $signature = 'import:tenancy-csv {file?}';

    protected $description = 'Import data sewa (Tenancy) dari file CSV';

    public function handle(TenancyService $tenancyService)
    {
        $file = $this->argument('file') ?? public_path('template_csv.csv');

        if (!file_exists($file)) {
            $this->error("File tidak ditemukan: {$file}");
            return;
        }

        $this->info("Membaca file: {$file}");

        $reader = SimpleExcelReader::create($file);
        $count = 0;

        $reader->getRows()->each(function (array $row) use ($tenancyService, &$count) {
            try {
                $propertyName = trim($row['Nama Kos'] ?? '');
                $property = Property::where('name', $propertyName)->first();

                if (!$property) {
                    $this->warn("Properti tidak ditemukan untuk '{$propertyName}'. Melewati baris ini.");
                    return;
                }

                $data = $row;
                $data['property_id'] = $property->id;

                $tenancyService->migrateTenancy($data);
                
                $this->info("Berhasil migrasi data untuk: " . ($row['Nama'] ?? 'Tidak diketahui'));
                $count++;
            } catch (\Exception $e) {
                $this->error("Error memproses baris CSV: " . $e->getMessage());
            }
        });

        $this->info("Tahap pembacaan CSV selesai! Total terproses: {$count} data.");
    }
}
