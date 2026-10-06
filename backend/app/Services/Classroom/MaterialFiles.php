<?php

namespace App\Services\Classroom;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use ZipArchive;

class MaterialFiles
{
    private const MIME = [
        'pdf' => ['application/pdf'],
        'txt' => ['text/plain'],
        'jpg' => ['image/jpeg'], 'jpeg' => ['image/jpeg'],
        'png' => ['image/png'], 'gif' => ['image/gif'], 'webp' => ['image/webp'],
        'doc' => ['application/msword', 'application/x-ole-storage'],
        'xls' => ['application/vnd.ms-excel', 'application/x-ole-storage'],
        'ppt' => ['application/vnd.ms-powerpoint', 'application/x-ole-storage'],
        'docx' => ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'],
        'xlsx' => ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip'],
        'pptx' => ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/zip'],
    ];

    public function store(UploadedFile $file, int $institution, int|string $course): array
    {
        $ext = strtolower($file->getClientOriginalExtension());
        $mime = (new \finfo(FILEINFO_MIME_TYPE))->file($file->getRealPath());
        $valid = $file->isValid() && $file->getSize() > 0 && $file->getSize() <= 2 * 1024 * 1024 &&
            isset(self::MIME[$ext]) && in_array($mime, self::MIME[$ext], true);
        if ($valid && in_array($ext, ['docx', 'xlsx', 'pptx'], true)) {
            $zip = new ZipArchive;
            $valid = $zip->open($file->getRealPath()) === true;
            if ($valid) {
                $part = ['docx' => 'word/document.xml', 'xlsx' => 'xl/workbook.xml', 'pptx' => 'ppt/presentation.xml'][$ext];
                $valid = $zip->locateName('[Content_Types].xml') !== false && $zip->locateName($part) !== false;
                for ($i = 0; $i < $zip->numFiles; $i++) {
                    if (str_contains(strtolower($zip->getNameIndex($i)), 'vbaproject.bin')) {
                        $valid = false;
                        break;
                    }
                }
                $zip->close();
            }
        }
        if (! $valid) {
            throw ValidationException::withMessages(['file' => 'Archivo no permitido o contenido incompatible. Máximo 2 MiB: PDF, Office sin extensión de macros, TXT, JPG, PNG, GIF o WEBP.']);
        }
        $name = basename(str_replace('\\', '/', $file->getClientOriginalName()));
        $name = preg_replace('/[^\pL\pN ._()-]/u', '_', $name) ?: "material.$ext";
        $path = $file->storeAs("$institution/$course", Str::uuid().".$ext", 'materials');
        if (! $path) {
            throw new \RuntimeException('Private material storage failed.');
        }

        return [
            'file_path' => $path,
            'original_filename' => mb_substr($name, 0, 180),
            'mime_type' => $mime,
            'file_size' => $file->getSize(),
        ];
    }

    public function discard(?string $path): void
    {
        if ($path) {
            Storage::disk('materials')->delete($path);
        }
    }
}
