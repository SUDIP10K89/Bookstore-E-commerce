
'use client';
import { useState, useEffect, useRef } from 'react';
import { getRecommendationsAction } from '@/app/actions';
import { Book, books as allBooks } from '@/lib/books';
import { BookCard } from './book-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from './ui/skeleton';
import Autoplay from "embla-carousel-autoplay"

interface RecommendationsProps {
  currentBookId?: string;
}

export function Recommendations({ currentBookId }: RecommendationsProps) {
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const plugin = useRef(
    Autoplay({ delay: 1000, stopOnInteraction: true })
  )

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const browsingHistoryRaw = localStorage.getItem('browsingHistory');
        const purchaseHistoryRaw = localStorage.getItem('purchaseHistory');
        let hasHistory = false;

        const browsingHistoryTitles: string[] = [];
        if (browsingHistoryRaw) {
            const historyIds: string[] = JSON.parse(browsingHistoryRaw);
            if(historyIds.length > 0) {
              hasHistory = true;
              const { books } = await import('@/lib/books');
              historyIds.forEach(id => {
                  const book = books.find(b => b.id === id);
                  if (book) browsingHistoryTitles.push(book.title);
              });
            }
        }
        
        const purchaseHistoryTitles: string[] = purchaseHistoryRaw ? JSON.parse(purchaseHistoryRaw) : [];
        if(purchaseHistoryTitles.length > 0) hasHistory = true;

        let recommendations: Book[] = [];
        if (hasHistory) {
          recommendations = await getRecommendationsAction({
            browsingHistory: browsingHistoryTitles,
            purchaseHistory: purchaseHistoryTitles,
          });
        }
        
        // If no recommendations from AI or no history, get some defaults.
        if (recommendations.length === 0) {
          recommendations = [...allBooks].sort(() => 0.5 - Math.random()).slice(0, 7);
        }
          
        const filteredRecs = currentBookId ? recommendations.filter(book => book.id !== currentBookId) : recommendations;

        setRecommendedBooks(filteredRecs);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        // Fallback on error to random popular books
        const defaultRecs = [...allBooks].sort(() => 0.5 - Math.random()).slice(0, 7);
        setRecommendedBooks(defaultRecs);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentBookId]);

  if (isLoading) {
    return (
      <section className="bg-card border-y">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <h2 className="text-3xl font-headline font-bold text-foreground mb-8 text-center">
            {currentBookId ? 'Customers Also Bought' : 'For You'}
          </h2>
          <div className="flex space-x-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex-1">
                    <Skeleton className="h-[250px] w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  if (recommendedBooks.length === 0) {
    return null;
  }

  return (
    <section className="bg-card border-y">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <h2 className="text-3xl font-headline font-bold text-foreground mb-8 text-center">
          {currentBookId ? 'Customers Also Bought' : 'For You'}
        </h2>
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: 'start',
            loop: recommendedBooks.length > 5,
          }}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {recommendedBooks.map((book) => (
              <CarouselItem key={book.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                <div className="p-1">
                  <BookCard book={book} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
