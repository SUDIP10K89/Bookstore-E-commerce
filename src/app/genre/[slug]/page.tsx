
import { Book, books, genres } from '@/lib/books';
import { BookCard } from '@/components/book-card';
import { notFound } from 'next/navigation';

export default function GenrePage({ params }: { params: { slug: string } }) {
  const genre = genres.find(g => g.toLowerCase().replace(/ /g, '-') === params.slug);

  if (!genre) {
    notFound();
  }

  const booksInGenre = books.filter(book => book.genre === genre);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">{genre}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Discover books in the {genre} genre.
        </p>
      </div>
      {booksInGenre.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {booksInGenre.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No books found in this genre yet.</p>
        </div>
      )}
    </div>
  );
}
