<?php

use Inertia\Testing\AssertableInertia as Assert;

test('terms conditions page can be rendered via inertia', function () {
    $response = $this->get(route('terms-conditions'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('TermsConditions'));
});
