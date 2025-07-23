export default function OnboardingLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/40">
            <div className="flex flex-col p-6 space-y-8 max-w-4xl mx-auto">
                {/* Progress bar skeleton */}
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />

                {/* Header skeleton */}
                <div className="text-center space-y-4">
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64 mx-auto" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-96 mx-auto" />
                </div>

                {/* Form skeleton */}
                <div className="space-y-6">
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                </div>

                {/* Navigation buttons skeleton */}
                <div className="flex justify-between">
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-32" />
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-32" />
                </div>
            </div>
        </div>
    )
}
