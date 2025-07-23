export default function LandingPageLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/40">
            {/* Hero section skeleton */}
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 py-24">
                    <div className="text-center space-y-8">
                        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-96 mx-auto" />
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-128 mx-auto" />
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-96 mx-auto" />
                        <div className="flex justify-center gap-4">
                            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-32" />
                            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-32" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Features section skeleton */}
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center space-y-4 mb-16">
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64 mx-auto" />
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-96 mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats section skeleton */}
            <div className="py-24 bg-gray-100 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="text-center space-y-2">
                                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24 mx-auto" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32 mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
