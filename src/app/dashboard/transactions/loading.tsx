export default function TransactionsLoading() {
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

                {/* Filters skeleton */}
                <div className="flex flex-wrap gap-4">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-40" />
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-40" />
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-40" />
                </div>

                {/* Table skeleton */}
                <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
                    {/* Table header */}
                    <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32" />
                    </div>

                    {/* Table rows */}
                    <div className="divide-y divide-gray-200 dark:divide-slate-700">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                            <div key={i} className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32" />
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination skeleton */}
                <div className="flex justify-center">
                    <div className="flex space-x-2">
                        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    )
}
