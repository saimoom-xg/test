<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ReviewController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/reviews/index', [
            'reviews' => ProductReview::query()
                ->with(['product', 'customer'])
                ->latest()
                ->paginate(20),
        ]);
    }

    public function show(ProductReview $review): Response
    {
        $review->load(['product', 'customer']);
        
        return Inertia::render('admin/reviews/show', [
            'review' => $review,
        ]);
    }

    public function updateStatus(Request $request, ProductReview $review): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $review->update(['status' => $validated['status']]);

        return back()->with('success', 'Review status updated successfully.');
    }

    public function destroy(ProductReview $review): RedirectResponse
    {
        $review->delete();
        return redirect()->route('admin.reviews.index')->with('success', 'Review deleted successfully.');
    }
}
