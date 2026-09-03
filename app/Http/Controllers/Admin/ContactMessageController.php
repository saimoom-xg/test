<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/contacts/index', [
            'messages' => ContactMessage::query()->with('order')->latest()->paginate(20),
        ]);
    }

    public function show(ContactMessage $contact): Response
    {
        $contact->load(['order', 'replies.user']);

        if ($contact->status === 'new') {
            $contact->update(['status' => 'read']);
        }

        return Inertia::render('admin/contacts/show', [
            'contact' => $contact,
        ]);
    }

    public function reply(Request $request, ContactMessage $contact): RedirectResponse
    {
        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $contact->replies()->create([
            'user_id' => $request->user()->id,
            'message' => $validated['message'],
        ]);

        $contact->update(['status' => 'replied']);

        return back()->with('success', 'Reply sent successfully.');
    }

    public function close(ContactMessage $contact): RedirectResponse
    {
        $contact->update(['status' => 'closed']);

        return back()->with('success', 'Message marked as closed.');
    }
}
