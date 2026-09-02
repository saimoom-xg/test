<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', fn (Blueprint $t) => $t->softDeletes());
        Schema::table('categories', fn (Blueprint $t) => $t->softDeletes());
        Schema::table('brands', fn (Blueprint $t) => $t->softDeletes());
        Schema::table('orders', fn (Blueprint $t) => $t->softDeletes());
        Schema::table('customers', fn (Blueprint $t) => $t->softDeletes());
        Schema::table('carts', fn (Blueprint $t) => $t->softDeletes());
        Schema::table('users', fn (Blueprint $t) => $t->softDeletes());
    }

    public function down(): void
    {
        Schema::table('users', fn (Blueprint $t) => $t->dropSoftDeletes());
        Schema::table('carts', fn (Blueprint $t) => $t->dropSoftDeletes());
        Schema::table('customers', fn (Blueprint $t) => $t->dropSoftDeletes());
        Schema::table('orders', fn (Blueprint $t) => $t->dropSoftDeletes());
        Schema::table('brands', fn (Blueprint $t) => $t->dropSoftDeletes());
        Schema::table('categories', fn (Blueprint $t) => $t->dropSoftDeletes());
        Schema::table('products', fn (Blueprint $t) => $t->dropSoftDeletes());
    }
};
