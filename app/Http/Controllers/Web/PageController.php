<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function contact(): Response
    {
        return Inertia::render('Contact');
    }

    public function about(): Response
    {
        return Inertia::render('About');
    }

    public function privacyPolicy(): Response
    {
        return Inertia::render('PrivacyPolicy');
    }

    public function termsConditions(): Response
    {
        return Inertia::render('TermsConditions');
    }

    public function shippingReturns(): Response
    {
        return Inertia::render('ShippingReturns');
    }
}
