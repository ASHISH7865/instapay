export default function SignUpLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/40 flex items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8">
                {/* Logo skeleton */}
                <div className="text-center">
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32 mx-auto" />
                </div>

                {/* Form skeleton */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48 mx-auto" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64 mx-auto" />
                    </div>

                    <div className="space-y-4">
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    </div>

                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32 mx-auto" />
                </div>
            </div>
        </div>
    )
}
