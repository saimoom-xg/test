<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VariantController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/variants/index', [
            'variants' => ProductVariant::query()
                ->with('product')
                ->latest()
                ->paginate(20),
        ]);
    }
}
