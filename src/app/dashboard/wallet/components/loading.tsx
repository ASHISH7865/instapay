export default function WalletComponentsLoading() {
    return (
        <div className="space-y-6">
            {/* Balance card skeleton */}
            <div className="h-48 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl animate-pulse" />

            {/* Quick actions skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                ))}
            </div>

            {/* Transactions skeleton */}
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>
    )
}
