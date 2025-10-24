'use client'

import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'



const FilterSidebar = ({ brands }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-4 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        <SlidersHorizontal size={18} className="text-muted-foreground" />
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Price Range</h4>
        <Slider
          defaultValue={[0, 2000]}
          max={2000}
          step={100}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>₹0</span>
          <span>₹2000</span>
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h4 className="font-medium mb-3">Brands</h4>
        <div className="space-y-2">
          {brands.slice(0, 5).map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox id={brand} />
              <Label htmlFor={brand} className="cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FilterSidebar
