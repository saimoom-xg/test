<?php

namespace Database\Seeders;

use App\Models\Country;
use App\Models\Currency;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\Setting;
use App\Models\ShippingMethod;
use App\Models\TaxRate;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedRolesAndPermissions();
        $this->seedConfigTables();
        $this->seedDefaultWarehouse();
        $this->seedAdminUser();
        $this->seedCatalog();
        $this->seedCustomersAndOrders();
        $this->seedSettings();
    }

    private function seedRolesAndPermissions(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $managerRole = Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);
        $staffRole = Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'web']);

        $permissions = [
            'manage products',
            'manage categories',
            'manage brands',
            'manage inventory',
            'manage orders',
            'manage customers',
            'manage settings',
            'manage users',
            'view dashboard',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $adminRole->syncPermissions(Permission::all());
        $managerRole->syncPermissions([
            'manage products', 'manage categories', 'manage brands',
            'manage inventory', 'manage orders', 'manage customers',
            'view dashboard',
        ]);
        $staffRole->syncPermissions(['view dashboard', 'manage orders']);
    }

    private function seedConfigTables(): void
    {
        Currency::firstOrCreate(['code' => 'USD'], [
            'name' => 'US Dollar',
            'symbol' => '$',
            'exchange_rate' => 1,
            'is_default' => true,
            'is_active' => true,
        ]);

        Currency::firstOrCreate(['code' => 'EUR'], [
            'name' => 'Euro',
            'symbol' => '€',
            'exchange_rate' => 0.92,
            'is_active' => true,
        ]);

        Country::firstOrCreate(['iso2' => 'US'], [
            'iso3' => 'USA',
            'name' => 'United States',
            'phone_code' => '+1',
            'currency_code' => 'USD',
            'is_active' => true,
        ]);

        TaxRate::firstOrCreate(['name' => 'Standard'], [
            'rate' => 8.5,
            'country_code' => 'US',
            'is_inclusive' => false,
            'is_active' => true,
        ]);

        ShippingMethod::firstOrCreate(['code' => 'standard'], [
            'name' => 'Standard Shipping',
            'description' => '5-7 business days',
            'flat_rate' => 5.99,
            'is_active' => true,
        ]);

        ShippingMethod::firstOrCreate(['code' => 'express'], [
            'name' => 'Express Shipping',
            'description' => '1-3 business days',
            'flat_rate' => 14.99,
            'is_active' => true,
        ]);

        PaymentMethod::firstOrCreate(['code' => 'cod'], [
            'name' => 'Cash on Delivery',
            'description' => 'Pay when your order arrives',
            'driver' => 'cod',
            'is_active' => true,
        ]);

        PaymentMethod::firstOrCreate(['code' => 'card'], [
            'name' => 'Credit/Debit Card',
            'description' => 'Secure card payments',
            'driver' => 'stripe',
            'is_active' => true,
        ]);

        $statuses = [
            ['code' => 'pending', 'name' => 'Pending', 'color' => 'gray', 'is_default' => true, 'sort_order' => 1],
            ['code' => 'processing', 'name' => 'Processing', 'color' => 'blue', 'sort_order' => 2],
            ['code' => 'completed', 'name' => 'Completed', 'color' => 'green', 'sort_order' => 3],
            ['code' => 'cancelled', 'name' => 'Cancelled', 'color' => 'red', 'sort_order' => 4],
            ['code' => 'refunded', 'name' => 'Refunded', 'color' => 'yellow', 'sort_order' => 5],
        ];

        foreach ($statuses as $status) {
            OrderStatus::firstOrCreate(['code' => $status['code']], array_merge($status, ['is_active' => true]));
        }
    }

    private function seedDefaultWarehouse(): void
    {
        Warehouse::firstOrCreate(['code' => 'MAIN'], [
            'name' => 'Main Warehouse',
            'address_line1' => '100 Commerce Way',
            'city' => 'New York',
            'state' => 'NY',
            'postal_code' => '10001',
            'country_code' => 'US',
            'is_active' => true,
            'is_default' => true,
        ]);
    }

    private function seedAdminUser(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );

        $admin->assignRole('admin');
    }

    private function seedCatalog(): void
    {
        $this->call(ChocolateCatalogSeeder::class);
    }

    private function seedCustomersAndOrders(): void
    {
        if (Customer::count() > 0) {
            return;
        }

        $statuses = OrderStatus::query()->get()->keyBy('code');

        foreach (range(1, 20) as $i) {
            $customer = Customer::factory()->create();

            foreach (range(1, rand(1, 3)) as $j) {
                $products = Product::inRandomOrder()->limit(rand(1, 3))->get();
                $subtotal = 0;

                $order = Order::factory()->create([
                    'customer_id' => $customer->id,
                    'order_status_id' => $statuses->random()->id,
                    'customer_email' => $customer->email,
                    'customer_phone' => $customer->phone,
                    'customer_first_name' => $customer->first_name,
                    'customer_last_name' => $customer->last_name,
                ]);

                foreach ($products as $product) {
                    $qty = rand(1, 3);
                    $price = $product->current_price;
                    $itemSubtotal = $price * $qty;
                    $subtotal += $itemSubtotal;

                    OrderItem::factory()->create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'name' => $product->name,
                        'sku' => $product->sku,
                        'quantity' => $qty,
                        'unit_price' => $price,
                        'subtotal' => $itemSubtotal,
                        'total' => $itemSubtotal,
                    ]);
                }

                $order->update([
                    'subtotal' => $subtotal,
                    'grand_total' => $subtotal + 10,
                ]);
            }
        }
    }

    private function seedSettings(): void
    {
        Setting::firstOrCreate(['group' => 'general', 'key' => 'site_name'], [
            'value' => 'Admin Store',
            'type' => 'string',
            'is_public' => true,
        ]);

        Setting::firstOrCreate(['group' => 'general', 'key' => 'default_currency'], [
            'value' => 'USD',
            'type' => 'string',
            'is_public' => true,
        ]);

        Setting::firstOrCreate(['group' => 'general', 'key' => 'enable_guest_checkout'], [
            'value' => '1',
            'type' => 'boolean',
            'is_public' => true,
        ]);
    }
}
