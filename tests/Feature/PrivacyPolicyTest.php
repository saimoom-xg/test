<?php

use Inertia\Testing\AssertableInertia as Assert;

test('privacy policy page can be rendered via inertia', function () {
    $response = $this->get(route('privacy-policy'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('PrivacyPolicy'));
});
