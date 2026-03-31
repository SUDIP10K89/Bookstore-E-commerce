
'use client';
import { Book, books } from '@/lib/books';
import { BookCard } from '@/components/book-card';

export default function BestsellersPage() {
  const bestsellers = books.sort((a, b) => b.rating - a.rating).slice(0, 10);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Bestsellers</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Our most popular and highest-rated books.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {bestsellers.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
