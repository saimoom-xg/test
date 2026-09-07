<?php

use Inertia\Testing\AssertableInertia as Assert;

test('contact page can be rendered via inertia', function () {
    $response = $this->get(route('contact'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('Contact'));
});
