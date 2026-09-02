<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class TagController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/tags/index', [
            'tags' => Tag::query()->latest()->paginate(20),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tags,name',
        ]);

        Tag::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
        ]);

        return back()->with('success', 'Tag created successfully.');
    }

    public function destroy(Tag $tag): RedirectResponse
    {
        $tag->delete();
        return back()->with('success', 'Tag deleted successfully.');
    }
}
