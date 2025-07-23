'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { instapayBrandColors } from '@/lib/themes/instapay-brand-colors'

export function BrandColorShowcase() {
  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">InstaPay Brand Colors</h1>
        <p className="text-muted-foreground">Professional financial app color palette</p>
      </div>

      {/* Primary Brand Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Primary Brand Colors</CardTitle>
          <CardDescription>Main brand teal colors for primary elements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(instapayBrandColors.primary).map(([shade, color]) => (
              <div key={shade} className="text-center">
                <div
                  className="w-full h-16 rounded-lg mb-2 border"
                  style={{ backgroundColor: color }}
                />
                <p className="text-sm font-medium">{shade}</p>
                <p className="text-xs text-muted-foreground">{color}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Secondary Brand Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Secondary Brand Colors</CardTitle>
          <CardDescription>Complementary blue colors for secondary elements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(instapayBrandColors.secondary).map(([shade, color]) => (
              <div key={shade} className="text-center">
                <div
                  className="w-full h-16 rounded-lg mb-2 border"
                  style={{ backgroundColor: color }}
                />
                <p className="text-sm font-medium">{shade}</p>
                <p className="text-xs text-muted-foreground">{color}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Semantic Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Semantic Colors</CardTitle>
          <CardDescription>Colors for different states and feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Object.entries(instapayBrandColors.accent).map(([type, colors]) => (
              <div key={type}>
                <h3 className="font-semibold mb-3 capitalize">{type}</h3>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(colors).slice(0, 6).map(([shade, color]) => (
                    <div key={shade} className="text-center">
                      <div
                        className="w-full h-12 rounded border"
                        style={{ backgroundColor: color }}
                      />
                      <p className="text-xs mt-1">{shade}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Status Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Financial Status Colors</CardTitle>
          <CardDescription>Colors for financial transactions and amounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(instapayBrandColors.financial).map(([status, color]) => (
              <div key={status} className="text-center">
                <div
                  className="w-full h-16 rounded-lg mb-2 border flex items-center justify-center"
                  style={{ backgroundColor: color }}
                >
                  <span className="text-white font-semibold capitalize">{status}</span>
                </div>
                <p className="text-sm font-medium capitalize">{status}</p>
                <p className="text-xs text-muted-foreground">{color}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Usage Examples</CardTitle>
          <CardDescription>How to use the brand colors in components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Buttons */}
          <div>
            <h4 className="font-semibold mb-2">Buttons</h4>
            <div className="flex flex-wrap gap-2">
              <button className="bg-instapay-500 hover:bg-instapay-600 text-white px-4 py-2 rounded-lg">
                Primary Button
              </button>
              <button className="bg-instapay-100 hover:bg-instapay-200 text-instapay-700 px-4 py-2 rounded-lg">
                Secondary Button
              </button>
              <button className="bg-success-500 hover:bg-success-600 text-white px-4 py-2 rounded-lg">
                Success Button
              </button>
              <button className="bg-error-500 hover:bg-error-600 text-white px-4 py-2 rounded-lg">
                Error Button
              </button>
            </div>
          </div>

          {/* Status Badges */}
          <div>
            <h4 className="font-semibold mb-2">Status Badges</h4>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-financial-positive text-white">Completed</Badge>
              <Badge className="bg-financial-pending text-white">Pending</Badge>
              <Badge className="bg-financial-failed text-white">Failed</Badge>
              <Badge className="bg-financial-neutral text-white">Neutral</Badge>
            </div>
          </div>

          {/* Cards */}
          <div>
            <h4 className="font-semibold mb-2">Cards</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-instapay-200 bg-instapay-50">
                <CardHeader>
                  <CardTitle className="text-instapay-700">Primary Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-instapay-600">This card uses primary brand colors</p>
                </CardContent>
              </Card>
              <Card className="border-success-200 bg-success-50">
                <CardHeader>
                  <CardTitle className="text-success-700">Success Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-success-600">This card uses success colors</p>
                </CardContent>
              </Card>
              <Card className="border-warning-200 bg-warning-50">
                <CardHeader>
                  <CardTitle className="text-warning-700">Warning Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-warning-600">This card uses warning colors</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
