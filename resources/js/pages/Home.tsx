import { Head, usePage } from '@inertiajs/react';
import CategoryBadgeList from '@/components/landing/CategoryBadgeList';
import FeaturedFlashSaleGridBlock from '@/components/landing/FeaturedFlashSaleGridBlock';
import ProductCard from '@/components/landing/ProductCard';
import PromotionalContentGridBlock from '@/components/landing/PromotionalContentGridBlock';

export default function Home() {
    const {
        allProducts: allProductsProp,
        categories,
        featuredProducts,
        newArrivals,
        bestSellers,
        flashSale,
        saleProducts,
        topPicks,
    } = usePage<any>().props;

    // Use all published products from backend; fallback to deduplicating sections if needed
    const allProductsMap = new Map();
    [
        ...(allProductsProp || []),
        ...(newArrivals || []),
        ...(bestSellers || []),
        ...(topPicks || []),
        ...(featuredProducts || []),
    ].forEach((p: any) => {
        if (p && p.id) {
            allProductsMap.set(p.id, p);
        }
    });
    const allProducts = allProductsProp && allProductsProp.length > 0
        ? allProductsProp
        : Array.from(allProductsMap.values());

    // Prepare products for the Flash Sale block - strictly sale/offer items only
    const flashList = [
        ...(flashSale?.products?.map((fp: any) => fp.product) || []),
        ...(saleProducts || []),
    ].filter(
        (p: any) =>
            p &&
            p.id &&
            p.sale_price !== null &&
            p.sale_price !== undefined &&
            Number(p.sale_price) > 0 &&
            Number(p.sale_price) < Number(p.price)
    );

    const flashProductsMap = new Map();
    flashList.forEach((p: any) => flashProductsMap.set(p.id, p));
    const flashSaleProducts = Array.from(flashProductsMap.values());

    // Slicing products for the 4-column catalog grid:
    // Row 1: First 4 regular product cards (fills 4 columns)
    const row1Products = allProducts.slice(0, 5);

    // Row 2: Next 2 regular cards (pair with 2-column Flash Sale block to complete 4 columns)
    const row2Products = allProducts.slice(5, 7);

    // Row 3 onwards: All remaining regular product cards
    const remainingProducts = allProducts.slice(7);

    // Build custom promo offers if featured products are present
    const promoOffers = featuredProducts && featuredProducts.length > 0 ? [
        {
            id: 'promo-1',
            badge: "Chef's Signature Selection",
            title: featuredProducts[0].name,
            subtitle: featuredProducts[0].brand?.name || 'Grand Cru Heritage',
            description:
                featuredProducts[0].short_description ||
                'Single-origin roasted Criollo cocoa beans blended with alpine cream and a crisp artisanal finish.',
            offerHighlight: 'Save 30% This Weekend Only',
            price: featuredProducts[0].sale_price || featuredProducts[0].price,
            originalPrice: featuredProducts[0].sale_price ? featuredProducts[0].price : null,
            ctaText: 'Claim Special Offer',
            ctaUrl: `/products/${featuredProducts[0].slug}`,
            product: {
                id: featuredProducts[0].id,
                name: featuredProducts[0].name,
                slug: featuredProducts[0].slug,
                brand: featuredProducts[0].brand?.name,
                image: featuredProducts[0].images?.[0]?.path?.startsWith('http')
                    ? featuredProducts[0].images[0].path
                    : featuredProducts[0].images?.[0]?.path
                    ? `/storage/${featuredProducts[0].images[0].path}`
                    : undefined,
            },
        },
        ...(featuredProducts.length > 1
            ? [
                  {
                      id: 'promo-2',
                      badge: 'Limited Seasonal Drop',
                      title: featuredProducts[1].name,
                      subtitle: featuredProducts[1].brand?.name || 'Exclusive Release',
                      description:
                          featuredProducts[1].short_description ||
                          'Small-batch confectionery created by European master chocolatiers with roasted caramelized hazelnut butter.',
                      offerHighlight: 'Complimentary Luxury Gift Box',
                      price: featuredProducts[1].sale_price || featuredProducts[1].price,
                      originalPrice: featuredProducts[1].sale_price ? featuredProducts[1].price : null,
                      ctaText: 'Shop Limited Drop',
                      ctaUrl: `/products/${featuredProducts[1].slug}`,
                      product: {
                          id: featuredProducts[1].id,
                          name: featuredProducts[1].name,
                          slug: featuredProducts[1].slug,
                          brand: featuredProducts[1].brand?.name,
                          image: featuredProducts[1].images?.[0]?.path?.startsWith('http')
                              ? featuredProducts[1].images[0].path
                              : featuredProducts[1].images?.[0]?.path
                              ? `/storage/${featuredProducts[1].images[0].path}`
                              : undefined,
                      },
                  },
              ]
            : []),
    ] : undefined;

    // product return JSX
    return (
        <>
            <Head title="Store - Curated Products & Special Offers" />
            <div className="flex-1 flex flex-col pb-12">
                {/* Categories Bar */}
                <CategoryBadgeList categories={categories || []} />

                {/* Full-Width Promotional Banner directly below category list */}
                <div className="w-full pb-2">
                    <PromotionalContentGridBlock products={featuredProducts} offers={promoOffers} />
                </div>

                {/* 4-Column Responsive Product Catalog Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6 pt-4 items-stretch">
                    {/* Row 1: First 4 Regular Product Cards */}
                    {row1Products.map((product: any) => (
                        <div key={product.id} className="col-span-1 flex justify-center w-full h-full">
                            <ProductCard product={product} />
                        </div>
                    ))}

                    {/* Row 2: Flash Sale Block (2 cols) + 2 Regular Cards (2 cols) */}
                    <FeaturedFlashSaleGridBlock
                        title="Flash Sale"
                        products={flashSaleProducts}
                    />

                    {row2Products.map((product: any) => (
                        <div key={product.id} className="col-span-1 flex justify-center w-full h-full">
                            <ProductCard product={product} />
                        </div>
                    ))}

                    {/* Row 3+: All Remaining Regular Product Cards */}
                    {remainingProducts.map((product: any) => (
                        <div key={product.id} className="col-span-1 flex justify-center w-full h-full">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
