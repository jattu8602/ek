'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  Settings,
  Shield,
  Heart,
  X,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/contexts/CartContext'
import SearchCommandPalette from '@/components/SearchCommandPalette'

const MainHeader = ({ isSticky = false }) => {
  const { data: session, status } = useSession()
  const { getCartItemsCount } = useCart()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const searchRef = useRef(null)

  // Debug session
  // console.log('MainHeader session:', { session, status })

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  // Handle outside click to close search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false)
      }
    }

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSearchOpen])

  const handleClearSearch = () => {
    setSearchQuery('')
    setIsSearchOpen(false)
  }

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault()
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(
        searchQuery.trim()
      )}`
    }
  }

  return (
    <header
      className={`
        bg-background border-b border-border
        transition-all duration-300 ease-in-out
        ${
          isSticky
            ? 'fixed top-0 left-0 right-0 z-50 shadow-md animate-in slide-in-from-top-5'
            : 'relative'
        }
      `}
    >
      <div className="container mx-auto px-4 py-3">
        {/* Mobile Layout */}
        <div className="md:hidden flex items-center gap-3">
          {/* Hamburger Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              {/* Mobile Sidebar Content */}
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <h2 className="font-bold text-lg">Menu</h2>
                </div>

                {/* User Section */}
                {status === 'loading' ? (
                  <div className="w-full h-16 bg-muted rounded-lg animate-pulse mb-6" />
                ) : session ? (
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 p-3 bg-muted rounded-lg mb-6 hover:bg-muted/80 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={session.user?.image || ''}
                        alt={session.user?.name || ''}
                      />
                      <AvatarFallback>
                        {session.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {session.user?.name || 'User'}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {session.user?.email}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div className="flex gap-2 mb-6">
                    <Link
                      href="/login"
                      className="flex-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link
                      href="/register"
                      className="flex-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button size="sm" className="w-full">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Navigation Items */}
                <div className="flex-1 space-y-1">
                  {session && (
                    <>
                      <Link
                        href="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <User className="mr-2 h-4 w-4" />
                          My Profile
                        </Button>
                      </Link>
                      <Link
                        href="/cart"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Cart
                          {session && (
                            <span className="ml-auto bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full">
                              {getCartItemsCount()}
                            </span>
                          )}
                        </Button>
                      </Link>
                      <Link
                        href="/profile?section=favorites"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <Heart className="mr-2 h-4 w-4" />
                          Favorites
                        </Button>
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                      </Link>
                      {session.user?.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Admin Panel
                          </Button>
                        </Link>
                      )}
                    </>
                  )}

                  <div className="border-t my-4" />

                  <Link
                    href="/sell-with-us"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      Sell with us
                    </Button>
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      Contact us
                    </Button>
                  </Link>

                  {session && (
                    <>
                      <div className="border-t my-4" />
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          handleSignOut()
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Mobile Search Bar */}
          <div className="flex-1" ref={searchRef}>
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                placeholder="Search products..."
                className="pl-9 pr-9 h-9 text-sm focus:border-[#EFF2F5] focus:ring-[#EFF2F5] hover:border-[#EFF2F5]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                onKeyDown={handleSearchSubmit}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                  onClick={handleClearSearch}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1">
                  <SearchCommandPalette
                    open={isSearchOpen}
                    onOpenChange={setIsSearchOpen}
                    isDropdown={true}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    className="text-xs"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="font-bold text-lg text-foreground">
              Ekta Krishi Kendra
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative w-full" ref={searchRef}>
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={20}
              />
              <Input
                placeholder="Search for seeds, pesticides, fertilizers..."
                className="pl-10 pr-10 focus:border-[#EFF2F5] focus:ring-[#EFF2F5] hover:border-[#EFF2F5]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                onKeyDown={handleSearchSubmit}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1">
                  <SearchCommandPalette
                    open={isSearchOpen}
                    onOpenChange={setIsSearchOpen}
                    isDropdown={true}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                </div>
              )}
            </div>
          </div>

          {/* User Links */}
          <div className="flex items-center gap-2">
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user?.image || ''}
                        alt={session.user?.name || ''}
                      />
                      <AvatarFallback>
                        {session.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user?.name && (
                        <p className="font-medium">{session.user.name}</p>
                      )}
                      {session.user?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?section=cart">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      My Cart
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?section=favorites">
                      <Heart className="mr-2 h-4 w-4" />
                      Favorites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {session.user?.role === 'ADMIN' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

                {/* Profile Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Profile
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {session.user?.name && (
                          <p className="font-medium">{session.user.name}</p>
                        )}
                        {session.user?.email && (
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {session.user.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile?section=cart">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        My Cart
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile?section=favorites">
                        <Heart className="mr-2 h-4 w-4" />
                        Favorites
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    {session.user?.role === 'ADMIN' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin">
                            <Shield className="mr-2 h-4 w-4" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:inline-flex"
                  >
                    <User size={18} className="mr-1" />
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden lg:inline-flex"
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
            <Link href="/sell-with-us">
            <Button
              variant="outline"
              size="sm"
              className="hidden lg:inline-flex"
            >
              Sell with us
            </Button>
            </Link>
            <Link href="/cart">
            <Button variant="default" size="sm" className="relative">
              <ShoppingCart size={18} className="mr-1" />
              <span className="hidden md:inline">Cart</span>
                {session && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {getCartItemsCount()}
              </span>
                )}
            </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default MainHeader
