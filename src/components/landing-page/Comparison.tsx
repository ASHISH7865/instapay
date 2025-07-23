import { Check, X } from 'lucide-react'

interface ComparisonFeature {
    feature: string
    instapay: boolean | string
    traditional: boolean | string
    competitors: boolean | string
}

const comparisonFeatures: ComparisonFeature[] = [
    {
        feature: "Instant Transfers",
        instapay: true,
        traditional: false,
        competitors: "Sometimes"
    },
    {
        feature: "Zero Hidden Fees",
        instapay: true,
        traditional: false,
        competitors: false
    },
    {
        feature: "24/7 Support",
        instapay: true,
        traditional: false,
        competitors: true
    },
    {
        feature: "Global Transfers",
        instapay: true,
        traditional: "High fees",
        competitors: true
    },
    {
        feature: "Mobile-First Design",
        instapay: true,
        traditional: false,
        competitors: true
    },
    {
        feature: "Investment Options",
        instapay: true,
        traditional: true,
        competitors: "Limited"
    },
    {
        feature: "Virtual Cards",
        instapay: true,
        traditional: false,
        competitors: "Sometimes"
    },
    {
        feature: "Real-time Analytics",
        instapay: true,
        traditional: false,
        competitors: "Basic"
    }
]

const renderValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
        return value ? (
            <Check className="h-5 w-5 text-green-500" />
        ) : (
            <X className="h-5 w-5 text-red-500" />
        )
    }
    return <span className="text-sm text-muted-foreground">{value}</span>
}

export const Comparison = () => {
    return (
        <section className="container py-24 sm:py-32">
            <div className="text-center space-y-4 mb-16">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Why choose
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Instapay</span>
                    ?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    See how we stack up against traditional banking and other fintech solutions
                </p>
            </div>

            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="text-left font-semibold text-lg">Features</div>
                    <div className="text-center">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg p-4">
                            <h3 className="font-bold">Instapay</h3>
                            <p className="text-xs opacity-90">The Future</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                            <h3 className="font-bold">Traditional Banks</h3>
                            <p className="text-xs text-muted-foreground">The Past</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                            <h3 className="font-bold">Competitors</h3>
                            <p className="text-xs text-muted-foreground">The Present</p>
                        </div>
                    </div>
                </div>

                {/* Comparison table */}
                <div className="space-y-4">
                    {comparisonFeatures.map((feature, index) => (
                        <div key={index} className="grid grid-cols-4 gap-4 items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border">
                            <div className="font-medium">{feature.feature}</div>
                            <div className="flex justify-center">
                                {renderValue(feature.instapay)}
                            </div>
                            <div className="flex justify-center">
                                {renderValue(feature.traditional)}
                            </div>
                            <div className="flex justify-center">
                                {renderValue(feature.competitors)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-12">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 max-w-2xl mx-auto">
                        <h3 className="text-xl font-semibold mb-4">Ready to experience the difference?</h3>
                        <p className="text-muted-foreground mb-6">
                            Join thousands of users who&apos;ve already switched to Instapay and never looked back.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">100K+</div>
                                <div className="text-sm text-muted-foreground">Happy Users</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">4.9/5</div>
                                <div className="text-sm text-muted-foreground">App Rating</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">99.9%</div>
                                <div className="text-sm text-muted-foreground">Uptime</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
