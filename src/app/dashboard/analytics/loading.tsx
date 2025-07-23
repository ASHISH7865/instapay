export default function AnalyticsLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/40">
            <div className="flex flex-col p-6 space-y-8 max-w-7xl mx-auto">
                {/* Breadcrumbs skeleton */}
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32" />

                {/* Header skeleton */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-2">
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48" />
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64" />
                    </div>
                    <div className="flex gap-3">
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-32" />
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-32" />
                    </div>
                </div>

                {/* Stats grid skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    ))}
                </div>

                {/* Charts skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                </div>

                {/* Additional charts skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                </div>
            </div>
        </div>
    )
}
