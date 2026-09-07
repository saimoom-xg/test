<?php

use Inertia\Testing\AssertableInertia as Assert;

test('about page can be rendered via inertia', function () {
    $response = $this->get(route('about'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('About'));
});
