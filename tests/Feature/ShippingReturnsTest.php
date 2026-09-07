<?php

use Inertia\Testing\AssertableInertia as Assert;

test('shipping returns page can be rendered via inertia', function () {
    $response = $this->get(route('shipping-returns'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('ShippingReturns'));
});
