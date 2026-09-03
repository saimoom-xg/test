export default function PaymentTrust() {
    return (
        <div className="mb-10 flex flex-col items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 text-center">Guaranteed Safe Checkout</p>
            <div className="flex gap-6 items-center flex-wrap justify-center text-3xl text-gray-400">
                <span className="hover:text-blue-700 transition-colors cursor-pointer">💳 Visa</span>
                <span className="hover:text-orange-500 transition-colors cursor-pointer">💳 Mastercard</span>
                <span className="hover:text-blue-500 transition-colors cursor-pointer">💳 Amex</span>
                <span className="hover:text-blue-800 transition-colors cursor-pointer">💳 PayPal</span>
                <span className="hover:text-black transition-colors cursor-pointer">🍎 Apple Pay</span>
            </div>
        </div>
    );
}
