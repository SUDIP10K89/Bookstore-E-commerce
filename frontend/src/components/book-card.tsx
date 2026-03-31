'use client';

import { Book } from '@/lib/books';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Star, StarHalf, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { addToCart } = useCart();
  const fullStars = Math.floor(book.rating);
  const halfStar = book.rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 h-full flex flex-col group rounded-none border-2">
      <Link href={`/books/${book.id}`} className="block overflow-hidden">
        <Image
          src={book.coverImage}
          alt={`Cover of ${book.title}`}
          width={400}
          height={600}
          className="w-full h-auto aspect-[2/3] object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          data-ai-hint="book cover"
        />
      </Link>
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="font-bold font-headline text-lg leading-tight truncate group-hover:text-primary">
            <Link href={`/books/${book.id}`}>{book.title}</Link>
          </h3>
          <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(fullStars)].map((_, i) => (
              <Star key={`full-${i}`} className="w-4 h-4 fill-primary text-primary" />
            ))}
            {halfStar && <StarHalf className="w-4 h-4 fill-primary text-primary" />}
            {[...Array(emptyStars)].map((_, i) => (
              <Star key={`empty-${i}`} className="w-4 h-4 text-muted-foreground/30" />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({book.rating})</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2">
          <p className="font-bold text-lg">${book.price.toFixed(2)}</p>
          <Button size="icon" variant="outline" onClick={() => addToCart(book)} aria-label={`Add ${book.title} to cart`} className="rounded-sm border-2">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
