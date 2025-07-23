import { Shield, Lock, Award, Users, Globe, CheckCircle } from 'lucide-react'

const trustItems = [
    {
        icon: <Shield className="h-8 w-8" />,
        title: "SOC 2 Type II",
        description: "Certified security standards"
    },
    {
        icon: <Lock className="h-8 w-8" />,
        title: "256-bit Encryption",
        description: "Bank-level security"
    },
    {
        icon: <Award className="h-8 w-8" />,
        title: "PCI DSS Compliant",
        description: "Payment security certified"
    },
    {
        icon: <Users className="h-8 w-8" />,
        title: "100K+ Users",
        description: "Trusted worldwide"
    },
    {
        icon: <Globe className="h-8 w-8" />,
        title: "50+ Countries",
        description: "Global reach"
    },
    {
        icon: <CheckCircle className="h-8 w-8" />,
        title: "99.9% Uptime",
        description: "Reliable service"
    }
]

const partners = [
    { name: "Visa", logo: "💳" },
    { name: "Mastercard", logo: "💳" },
    { name: "Stripe", logo: "💳" },
    { name: "Plaid", logo: "🔗" },
]

export const TrustIndicators = () => {
    return (
        <section className="container py-16">
            <div className="text-center space-y-4 mb-12">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Trusted by millions worldwide
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    We&apos;ve earned the trust of users and partners through our commitment to security, reliability, and transparency.
                </p>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
                {trustItems.map((item, index) => (
                    <div key={index} className="text-center group">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            {item.icon}
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                ))}
            </div>

            {/* Partners */}
            <div className="border-t pt-12">
                <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold text-muted-foreground">Partners & Integrations</h3>
                    <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                        {partners.map((partner, index) => (
                            <div key={index} className="flex items-center gap-2 text-lg font-medium">
                                <span className="text-2xl">{partner.logo}</span>
                                <span>{partner.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
