export default function PaymentCancel() {
    return (
        <section className="min-h-screen flex flex-col justify-center items-center bg-red-50 p-6">
            <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4">❌ Payment Cancelled</h1>
            <p className="text-lg md:text-xl text-red-800 max-w-md text-center">
                Your payment was not completed. Please try again or contact support.
            </p>
        </section>
    );
}
