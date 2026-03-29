'use client';

import * as React from 'react';
import { Book, books, genres } from '@/lib/books';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { BookCard } from '@/components/book-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight, Sparkles, TrendingUp, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Recommendations } from '@/components/recommendations';
import Autoplay from "embla-carousel-autoplay"

function HeroSection() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/collection?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center text-center overflow-hidden">
      {/* Background with enhanced overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/70 z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-background/10 z-20"></div>
      
      <Image
        src="https://images.unsplash.com/photo-1623771702313-39dc4f71d275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxib29rJTIwc3RvcmV8ZW58MHx8fHwxNzU3OTkyODk2fDA&ixlib=rb-4.1.0&q=80&w=1080"
        alt="A cozy, sunlit library nook with rows of books"
        data-ai-hint="book store"
        fill
        className="object-cover scale-105 animate-slow-zoom"
        priority
      />
      
      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary/30 rounded-full animate-pulse z-30"></div>
      <div className="absolute top-32 right-16 w-1 h-1 bg-primary/40 rounded-full animate-pulse delay-1000 z-30"></div>
      <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse delay-500 z-30"></div>
      
      <div className="relative z-30 p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
        <div className="mb-6 inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 text-sm text-primary">
          <Sparkles className="h-4 w-4" />
          Your Literary Journey Begins Here
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-headline font-bold text-white leading-[0.9] tracking-tight mb-6">
          Where will your
          <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            next read
          </span>
          take you?
        </h1>
        
        <p className="mt-8 text-xl md:text-2xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
          Discover timeless classics, modern masterpieces, and hidden gems. Your next great adventure is just a page away.
        </p>
        
        <div className="mt-12 max-w-2xl mx-auto flex flex-col items-center gap-6">
          <form onSubmit={handleSearch} className="flex w-full items-center gap-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-white/20">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 rounded-xl bg-primary/10">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <Input
                type="search"
                placeholder="Find a book, an author, a feeling..."
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-lg placeholder:text-slate-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white rounded-xl px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Discover
            </Button>
          </form>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm px-6"
            >
              <Link href="/collection">
                Explore Collection <ArrowRight className="ml-2 h-4 w-4"/>
              </Link>
            </Button>
            
            <div className="flex items-center gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                10k+ Books
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-400" />
                Award Winners
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedBooksCarousel() {
  const [featuredBooks, setFeaturedBooks] = React.useState<Book[]>([]);
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  React.useEffect(() => {
    const bestsellers = [...books]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
    const newReleases = [...books]
      .sort((a, b) => b.publishedYear - a.publishedYear)
      .slice(0, 3);
    const combined = [...new Set([...bestsellers, ...newReleases])].slice(0, 7);

    setFeaturedBooks(combined);
  }, []);

  if (featuredBooks.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 md:px-6 py-16 md:py-20">
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            
            <h2 className="text-4xl font-headline font-bold text-foreground">
              Reader Favorites
            </h2>
          </div>
          <p className="text-muted-foreground text-lg">Books our community can't put down</p>
        </div>
        
        <Button 
          variant="outline" 
          asChild 
          className="rounded-xl border-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
        >
          <Link href="/bestsellers">
            View All Bestsellers 
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      <div className="relative">
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {featuredBooks.map((book) => (
              <CarouselItem key={book.id} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                <div className="group">
                  <BookCard book={book} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="rounded-xl shadow-lg border-2" />
          <CarouselNext className="rounded-xl shadow-lg border-2" />
        </Carousel>
      </div>
    </section>
  );
}

function GenreHighlights() {
    const highlightedGenres = genres.slice(0, 4);
    
    const genreIcons = ['📚', '🔍', '❤️', '⚔️'];
    
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.1)_50%,transparent_75%,transparent_100%)] bg-[length:60px_60px]"></div>
            </div>
            
            <div className="container mx-auto px-4 md:px-6 py-16 md:py-20 relative">
                <div className="flex items-center justify-between mb-12">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-headline font-bold text-foreground">
                            Explore by Genre
                        </h2>
                        <p className="text-muted-foreground text-lg">Find your perfect literary adventure</p>
                    </div>
                    
                    <Button 
                        variant="outline" 
                        asChild 
                        className="rounded-xl border-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
                    >
                        <Link href="/genres">
                            All Genres 
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {highlightedGenres.map((genre, index) => (
                        <Link 
                            href={`/genre/${genre.toLowerCase().replace(/ /g, '-')}`} 
                            key={genre}
                            className="group"
                        >
                            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-500 ease-out transform hover:-translate-y-2 hover:rotate-1 h-full border-2 hover:border-primary/20 bg-gradient-to-br from-white via-white to-slate-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <CardHeader className="relative text-center p-8">
                                    <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                        {genreIcons[index]}
                                    </div>
                                    <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors duration-300">
                                        {genre}
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

function PromotionalBanner() {
    return (
        <section className="container mx-auto px-4 md:px-6 py-16 md:py-20">
            <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white rounded-3xl shadow-2xl">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)] bg-[length:40px_40px]"></div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-6 right-8 w-3 h-3 bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute bottom-8 right-16 w-2 h-2 bg-white/30 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute top-12 right-24 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-500"></div>
                
                <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left space-y-4 flex-1">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm">
                            <Sparkles className="h-4 w-4" />
                            Limited Time Offer
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-headline font-bold leading-tight">
                            Summer Reading
                            <span className="block">Sale!</span>
                        </h2>
                        
                        <p className="text-xl text-white/90 max-w-xl leading-relaxed">
                            Fresh stories for sunny days. Get up to 30% off on selected titles and discover your next page-turner.
                        </p>
                        
                        <div className="flex items-center gap-4 pt-2">
                            <div className="text-sm text-white/80">🏷️ Up to 30% off</div>
                            <div className="text-sm text-white/80">📚 100+ titles</div>
                            <div className="text-sm text-white/80">⏰ Ends soon</div>
                        </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                        <Button 
                            variant="secondary" 
                            size="lg" 
                            asChild 
                            className="bg-white text-primary hover:bg-white/90 rounded-xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            <Link href="/collection?filter=sale">
                                Shop the Sale 
                                <ArrowRight className="ml-2 h-5 w-5"/>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <Recommendations />
      <FeaturedBooksCarousel />
      <GenreHighlights />
      <PromotionalBanner />
      
      <style jsx global>{`
        @keyframes slow-zoom {
          0%, 100% { transform: scale(1.05); }
          50% { transform: scale(1.1); }
        }
        
        .animate-slow-zoom {
          animation: slow-zoom 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}