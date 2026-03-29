'use client';

import Link from 'next/link';
import {
  BookOpen,
  Menu,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

export function Header() {
  const { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block font-headline">
            LiteraryLane
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">Home</Link>
          <Link href="/collection" className="text-muted-foreground transition-colors hover:text-foreground">Collection</Link>
          <Link href="/bestsellers" className="text-muted-foreground transition-colors hover:text-foreground">Bestsellers</Link>
          <Link href="/genres" className="text-muted-foreground transition-colors hover:text-foreground">Genres</Link>
          <Link href="/new-releases" className="text-muted-foreground transition-colors hover:text-foreground">New Releases</Link>
        </nav>
        <div className="flex items-center justify-end gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0"
                  >
                    {cartCount}
                  </Badge>
                )}
                <span className="sr-only">Open cart</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Your Cart ({cartCount})</SheetTitle>
              </SheetHeader>
              <Separator />
              {cartItems.length > 0 ? (
                <>
                  <ScrollArea className="flex-1 pr-4">
                    <div className="flex flex-col gap-4">
                      {cartItems.map(({ book, quantity }) => (
                        <div key={book.id} className="flex items-start gap-4">
                          <Image
                            src={book.coverImage}
                            alt={book.title}
                            width={80}
                            height={120}
                            className="rounded-md object-cover"
                            data-ai-hint="book cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{book.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {book.author}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(book.id, quantity - 1)}><span className='sr-only'>Decrease quantity</span>-</Button>
                                <span>{quantity}</span>
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(book.id, quantity + 1)}><span className='sr-only'>Increase quantity</span>+</Button>
                              </div>
                              <p className="font-semibold">
                                ${(book.price * quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => removeFromCart(book.id)}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove item</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <Separator />
                  <div className="mt-auto">
                    <div className="flex justify-between font-bold text-lg mb-4">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <SheetClose asChild>
                      <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        <Link href="/checkout">Proceed to Checkout</Link>
                      </Button>
                    </SheetClose>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground" />
                  <p className="text-muted-foreground">Your cart is empty.</p>
                  <SheetClose asChild>
                    <Button variant="outline">Continue Shopping</Button>
                  </SheetClose>
                </div>
              )}
            </SheetContent>
          </Sheet>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/account">
              <User className="h-5 w-5" />
              <span className="sr-only">User account</span>
            </Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 text-lg mt-8">
                  <SheetClose asChild>
                    <Link href="/" className="text-foreground transition-colors hover:text-primary">Home</Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/collection" className="text-foreground transition-colors hover:text-primary">Collection</Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/bestsellers" className="text-foreground transition-colors hover:text-primary">Bestsellers</Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/genres" className="text-foreground transition-colors hover:text-primary">Genres</Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/new-releases" className="text-foreground transition-colors hover:text-primary">New Releases</Link>
                  </SheetClose>
                </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
