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
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import SearchCommandPalette from '@/components/SearchCommandPalette'
import { useCart } from '@/contexts/CartContext'

const MainHeader = ({ isSticky = false }) => {
  const { data: session, status } = useSession()
  const { getCartItemsCount } = useCart()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef(null)
  const mobileMenuRef = useRef(null)

  // Debug session
  console.log('MainHeader session:', { session, status })

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  // Handle outside click to close search and mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isSearchOpen || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSearchOpen, isMobileMenuOpen])

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
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
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={toggleMobileMenu}
          >
            <Menu size={20} />
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="hidden md:block font-bold text-lg text-foreground">
              Ekta Krishi Kendra
            </span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="flex-1 max-w-2xl mx-4 hidden lg:block">
            <div className="relative w-full" ref={searchRef}>
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={20}
              />
              <Input
                placeholder="Search for seeds, pesticides, fertilizers..."
                className="pl-10 pr-10"
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

          {/* User Links - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-2">
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
            ) : session ? (
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
            <Button
              variant="outline"
              size="sm"
              className="hidden lg:inline-flex"
            >
              Sell with us
            </Button>
            <Link href="/cart">
              <Button variant="default" size="sm" className="relative">
                <ShoppingCart size={18} className="mr-1" />
                <span className="hidden md:inline">Cart</span>
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {getCartItemsCount()}
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-50 bg-black/50" onClick={closeMobileMenu} />
            <div 
              ref={mobileMenuRef}
              className="fixed top-0 left-0 z-50 w-80 h-full bg-background border-r border-border shadow-lg transform transition-transform duration-300 ease-in-out"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                    <span className="font-bold text-lg text-foreground">
                      Ekta Krishi Kendra
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeMobileMenu}
                  >
                    <X size={20} />
                  </Button>
                </div>

                {/* Mobile Search Bar */}
                <div className="p-4 border-b border-border">
                  <div className="relative" ref={searchRef}>
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={20}
                    />
                    <Input
                      placeholder="Search products..."
                      className="pl-10 pr-10"
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

                {/* Mobile Navigation */}
                <div className="flex-1 overflow-y-auto">
                  <nav className="p-4 space-y-2">
                    {/* User Section */}
                    {status === 'loading' ? (
                      <div className="flex items-center gap-3 p-3">
                        <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                          <div className="h-3 bg-muted rounded w-32 animate-pulse" />
                        </div>
                      </div>
                    ) : session ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
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
                            {session.user?.name && (
                              <p className="font-medium truncate">{session.user.name}</p>
                            )}
                            {session.user?.email && (
                              <p className="text-sm text-muted-foreground truncate">
                                {session.user.email}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                            onClick={closeMobileMenu}
                          >
                            <User className="h-5 w-5" />
                            <span>My Profile</span>
                          </Link>
                          <Link
                            href="/cart"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                            onClick={closeMobileMenu}
                          >
                            <ShoppingCart className="h-5 w-5" />
                            <span>My Cart</span>
                            <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                              {getCartItemsCount()}
                            </span>
                          </Link>
                          <Link
                            href="/profile?section=favorites"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                            onClick={closeMobileMenu}
                          >
                            <Heart className="h-5 w-5" />
                            <span>Favorites</span>
                          </Link>
                          <Link
                            href="/settings"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                            onClick={closeMobileMenu}
                          >
                            <Settings className="h-5 w-5" />
                            <span>Settings</span>
                          </Link>
                          {session.user?.role === 'ADMIN' && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                              onClick={closeMobileMenu}
                            >
                              <Shield className="h-5 w-5" />
                              <span>Admin Panel</span>
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              handleSignOut()
                              closeMobileMenu()
                            }}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors w-full text-left"
                          >
                            <LogOut className="h-5 w-5" />
                            <span>Sign out</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Link
                          href="/login"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                          onClick={closeMobileMenu}
                        >
                          <User className="h-5 w-5" />
                          <span>Login</span>
                        </Link>
                        <Link
                          href="/register"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                          onClick={closeMobileMenu}
                        >
                          <User className="h-5 w-5" />
                          <span>Register</span>
                        </Link>
                      </div>
                    )}

                    {/* Additional Navigation Items */}
                    <div className="pt-4 border-t border-border">
                      <Link
                        href="/sell-with-us"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        onClick={closeMobileMenu}
                      >
                        <span>Sell with us</span>
                      </Link>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default MainHeader
