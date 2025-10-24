import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, MessageCircle } from 'lucide-react'
import { categories } from '@/data/products'
import Link from 'next/link' // Changed import from 'react-router-dom' to 'next/link'

const CategoryNavBar = () => {
  return (
    <nav className="bg-secondary border-b border-border">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Category Dropdowns */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  All Products <ChevronDown size={16} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-popover z-50">
                {categories.map((category) => (
                  <DropdownMenuSub key={category.slug}>
                    <DropdownMenuSubTrigger>
                      {category.name}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="bg-popover z-50">
                      {category.subcategories.map((sub) => (
                        <DropdownMenuItem key={sub} asChild>
                          {/* Replaced 'to' prop with 'href' */}
                          <Link href={`/${category.slug}/${sub.toLowerCase()}`}>
                            {sub}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {categories.slice(0, 3).map((category) => (
              <DropdownMenu key={category.slug}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:inline-flex"
                  >
                    {category.name} <ChevronDown size={16} className="ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-popover z-50">
                  {category.subcategories.map((sub) => (
                    <DropdownMenuItem key={sub} asChild>
                      {/* Replaced 'to' prop with 'href' */}
                      <Link href={`/${category.slug}/${sub.toLowerCase()}`}>
                        {sub}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>

          {/* Ask Experts Button */}
          <Button variant="accent" size="sm">
            <MessageCircle size={18} className="mr-1" />
            Ask Experts
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default CategoryNavBar
