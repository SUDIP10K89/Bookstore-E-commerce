
import { genres } from '@/lib/books';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export default function GenresPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Genres</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Explore books by your favorite genres.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {genres.map(genre => (
          <Link href={`/genre/${genre.toLowerCase().replace(/ /g, '-')}`} key={genre}>
            <Card className="hover:bg-accent/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-center font-headline">{genre}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
