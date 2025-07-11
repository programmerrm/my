export default function PaymentSuccess() {
    return (
        <section className="min-h-screen flex flex-col justify-center items-center bg-green-50 p-6">
            <h1 className="text-4xl md:text-5xl font-bold text-green-600 mb-4">✅ Payment Successful</h1>
            <p className="text-lg md:text-xl text-green-800 max-w-md text-center">
                Thank you for your purchase!
            </p>
        </section>
    );
}
