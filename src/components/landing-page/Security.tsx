import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Lock, Eye, Zap } from 'lucide-react'

const securityFeatures = [
    {
        icon: <Shield className="h-8 w-8 text-blue-600" />,
        title: "Bank-Level Security",
        description: "256-bit encryption and multi-factor authentication protect your transactions"
    },
    {
        icon: <Lock className="h-8 w-8 text-green-600" />,
        title: "Secure Transactions",
        description: "Every transaction is protected with end-to-end encryption"
    },
    {
        icon: <Eye className="h-8 w-8 text-purple-600" />,
        title: "Real-time Monitoring",
        description: "Advanced fraud detection keeps your money safe 24/7"
    },
    {
        icon: <Zap className="h-8 w-8 text-orange-600" />,
        title: "Instant Alerts",
        description: "Get notified immediately for any suspicious activity"
    }
]

export const Security = () => {
    return (
        <section className="container py-24 sm:py-32">
            <div className="text-center space-y-4 mb-16">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Your Security is Our
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Priority</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    We use industry-leading security measures to ensure your financial data and transactions are always protected.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {securityFeatures.map((feature, index) => (
                    <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                        <CardHeader className="text-center pb-4">
                            <div className="flex justify-center mb-4">
                                {feature.icon}
                            </div>
                            <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-16 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    SOC 2 Type II Certified
                </div>
            </div>
        </section>
    )
}
