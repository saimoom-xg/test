<?php

use App\Models\User;

test('guests are redirected to the login page from admin', function () {
    $response = $this->get('/admin');
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the admin dashboard', function () {
    $user = User::factory()->create();
    // $user->assignRole('admin');
    $user->syncRoles(['admin']);
    $this->actingAs($user);

    $response = $this->get(route('admin.dashboard'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/dashboard'));
});
