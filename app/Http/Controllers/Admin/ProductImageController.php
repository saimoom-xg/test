<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{
    public function destroy(ProductImage $productImage): RedirectResponse
    {
        if ($productImage->path && ! str_starts_with($productImage->path, 'http')) {
            Storage::disk('public')->delete($productImage->path);
        }

        $productImage->delete();

        return back()->with('toast', ['type' => 'success', 'message' => 'Image deleted.']);
    }

    public function batchDestroy(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:product_images,id'],
        ]);

        $images = ProductImage::whereIn('id', $validated['ids'])->get();

        foreach ($images as $image) {
            if ($image->path && ! str_starts_with($image->path, 'http')) {
                Storage::disk('public')->delete($image->path);
            }
            $image->delete();
        }

        return back()->with('toast', ['type' => 'success', 'message' => count($images).' images deleted.']);
    }
}
