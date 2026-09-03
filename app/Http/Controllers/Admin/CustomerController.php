<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CustomerRequest;
use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Customer::query()
            ->with(['user:id,email,phone', 'user.roles:id,name,guard_name'])
            ->withCount('orders');

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search): void {
                $q->where('email', 'like', "%{$search}%")
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $type = $request->string('type')->toString();

        if ($type === 'all') {
            $query->whereHas('user.roles', function ($q): void {
                $q->where('name', '!=', 'admin');
            });
        } else {
            $query->where('orders_count', '>', 0);
        }

        $customers = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/customers/index', [
            'customers' => $customers,
            'filters' => $request->only(['search', 'type']),
        ]);
    }

    public function show(Customer $customer): Response
    {
        $customer->load(['addresses', 'orders']);

        return Inertia::render('admin/customers/show', [
            'customer' => $customer,
        ]);
    }

    public function update(CustomerRequest $request, Customer $customer): RedirectResponse
    {
        $customer->update($request->validated());

        return to_route('admin.customers.index')
            ->with('toast', ['type' => 'success', 'message' => 'Customer updated.']);
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        $customer->delete();

        return to_route('admin.customers.index')
            ->with('toast', ['type' => 'success', 'message' => 'Customer deleted.']);
    }
}
