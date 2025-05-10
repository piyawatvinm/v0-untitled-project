"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ShoppingCart, ChefHat, Store, Pizza, Home, ClipboardList, Receipt, Scan } from "lucide-react"
import { UserProfile } from "./user-profile"

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/stores", label: "Stores", icon: Store },
    { href: "/products", label: "Products", icon: ClipboardList },
    { href: "/recommendations", label: "Recommendations", icon: Pizza },
    { href: "/orders", label: "Orders", icon: ShoppingCart },
    { href: "/ingredients", label: "Ingredients", icon: ClipboardList },
    { href: "/receipt", label: "Upload Receipt", icon: Receipt },
    { href: "/scan", label: "Scan Barcode", icon: Scan },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <ChefHat className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">ChefMate</span>
          </Link>
          <nav className="flex items-center space-x-2 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md transition-colors hover:text-foreground/80",
                    pathname === item.href ? "text-foreground bg-accent" : "text-foreground/60",
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex md:hidden">
          <Link href="/" className="flex items-center space-x-2">
            <ChefHat className="h-6 w-6" />
            <span className="font-bold">ChefMate</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <UserProfile />
          <nav className="flex items-center md:hidden">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:text-foreground/80",
                    isActive ? "text-foreground bg-accent" : "text-foreground/60",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
