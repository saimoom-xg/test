<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 32)->nullable()->after('email');
            $table->string('phone_country', 2)->nullable()->after('phone');
            $table->boolean('is_active')->default(true)->after('remember_token');
            $table->string('locale', 10)->default('en')->after('is_active');

            $table->index('phone');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['phone']);
            $table->dropColumn(['phone', 'phone_country', 'is_active', 'locale']);
        });
    }
};
