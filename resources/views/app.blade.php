<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        @php
            $siteTitle = \App\Models\Setting::get('general.site_title', config('app.name', 'StoreHub'));
            $siteDescription = \App\Models\Setting::get('general.site_description', '');
            $siteLogo = \App\Models\Setting::get('general.site_logo', '');
            $siteFavicon = \App\Models\Setting::get('general.site_favicon', '') ?: ($siteLogo ?: '/favicon.ico');
            $ogImage = \App\Models\Setting::get('general.site_og_image', '') ?: $siteLogo;
            $metaKeywords = \App\Models\Setting::get('analytics.meta_keywords', '');
            $metaAuthor = \App\Models\Setting::get('analytics.meta_author', '');
            $gaId = \App\Models\Setting::get('analytics.google_analytics_id', '');
            $gtmId = \App\Models\Setting::get('analytics.google_tag_manager_id', '');
            $fbPixel = \App\Models\Setting::get('analytics.facebook_pixel_id', '');
            $customCss = \App\Models\Setting::get('custom_code.custom_css', '');
            $headerJs = \App\Models\Setting::get('custom_code.custom_header_js', '');
            $footerJs = \App\Models\Setting::get('custom_code.custom_footer_js', '');
        @endphp

        <link rel="icon" href="{{ $siteFavicon ?: '/favicon.ico' }}" sizes="any">
        <link rel="apple-touch-icon" href="{{ $siteFavicon ?: '/apple-touch-icon.png' }}">

        @if($siteDescription)
            <meta name="description" content="{{ $siteDescription }}">
        @endif
        @if($metaKeywords)
            <meta name="keywords" content="{{ $metaKeywords }}">
        @endif
        @if($metaAuthor)
            <meta name="author" content="{{ $metaAuthor }}">
        @endif

        {{-- Open Graph / Social --}}
        <meta property="og:type" content="website">
        <meta property="og:title" content="{{ $siteTitle }}">
        @if($siteDescription)
            <meta property="og:description" content="{{ $siteDescription }}">
        @endif
        @if($ogImage)
            <meta property="og:image" content="{{ $ogImage }}">
        @endif

        @fonts
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Dancing+Script:wght@600;700&family=Caveat:wght@600;700&display=swap" rel="stylesheet">

        {{-- Google Analytics (GA4) --}}
        @if($gaId)
            <script async src="https://www.googletagmanager.com/gtag/js?id={{ $gaId }}"></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '{{ $gaId }}');
            </script>
        @endif

        {{-- Google Tag Manager --}}
        @if($gtmId)
            <script>
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','{{ $gtmId }}');
            </script>
        @endif

        {{-- Facebook Pixel --}}
        @if($fbPixel)
            <script>
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '{{ $fbPixel }}');
                fbq('track', 'PageView');
            </script>
        @endif

        {{-- Custom CSS --}}
        @if($customCss)
            <style>
                {!! $customCss !!}
            </style>
        @endif

        {{-- Custom Header JS / Tags --}}
        @if($headerJs)
            {!! $headerJs !!}
        @endif

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ $siteTitle }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        @if($gtmId)
            <noscript>
                <iframe src="https://www.googletagmanager.com/ns.html?id={{ $gtmId }}" height="0" width="0" style="display:none;visibility:hidden"></iframe>
            </noscript>
        @endif

        <x-inertia::app />

        {{-- Custom Footer JS --}}
        @if($footerJs)
            {!! $footerJs !!}
        @endif
    </body>
</html>
