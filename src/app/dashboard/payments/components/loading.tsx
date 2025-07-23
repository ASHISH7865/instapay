export default function PaymentComponentsLoading() {
    return (
        <div className="space-y-6">
            {/* Payment cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                ))}
            </div>

            {/* Recent payments skeleton */}
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>
    )
}
