'use client';

import * as React from 'react';
import { Book, books, genres } from '@/lib/books';
import { BookCard } from '@/components/book-card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal, Star } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from '@/components/ui/sheet';

const allLanguages = [...new Set(books.map(book => book.language))];
const maxPrice = Math.ceil(Math.max(...books.map(book => book.price)));

function FilterControls({
    selectedGenre,
    setSelectedGenre,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    selectedLanguage,
    setSelectedLanguage,
    resetFilters,
  }: {
    selectedGenre: string;
    setSelectedGenre: (value: string) => void;
    priceRange: [number, number];
    setPriceRange: (value: [number, number]) => void;
    minRating: number;
    setMinRating: (value: number) => void;
    selectedLanguage: string;
    setSelectedLanguage: (value: string) => void;
    resetFilters: () => void;
  }) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="genre-select" className="font-semibold text-sm">Genre</label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger id="genre-select"><SelectValue placeholder="Filter by genre" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {genres.map(genre => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
                <label className="font-semibold text-sm">Price Range</label>
                <Slider
                    min={0}
                    max={maxPrice}
                    step={1}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                </div>
            </div>

            <div className="space-y-2">
                <label className="font-semibold text-sm">Rating</label>
                <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                            key={star} 
                            onClick={() => setMinRating(star)} 
                            className={`cursor-pointer w-6 h-6 ${minRating >= star ? 'text-primary fill-primary' : 'text-muted-foreground/50'}`}
                        />
                    ))}
                </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="language-select" className="font-semibold text-sm">Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger id="language-select"><SelectValue placeholder="Filter by language" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {allLanguages.map(lang => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <Button variant="outline" onClick={resetFilters} className="w-full">Reset Filters</Button>
          </div>
    );
}

function Collection() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = React.useState(searchParams.get('search') || '');
  const [selectedGenre, setSelectedGenre] = React.useState('all');
  const [sortOrder, setSortOrder] = React.useState('rating-desc');
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, maxPrice]);
  const [selectedLanguage, setSelectedLanguage] = React.useState('all');
  const [minRating, setMinRating] = React.useState(0);

  const [filteredBooks, setFilteredBooks] = React.useState<Book[]>(books);

  const applyFilters = React.useCallback(() => {
    let newBooks = books.filter(book => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
      const matchesPrice = book.price >= priceRange[0] && book.price <= priceRange[1];
      const matchesLanguage = selectedLanguage === 'all' || book.language === selectedLanguage;
      const matchesRating = book.rating >= minRating;
      
      return matchesSearch && matchesGenre && matchesPrice && matchesLanguage && matchesRating;
    });

    newBooks.sort((a, b) => {
      switch (sortOrder) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating-desc':
          return b.rating - a.rating;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setFilteredBooks(newBooks);
  }, [searchTerm, selectedGenre, sortOrder, priceRange, selectedLanguage, minRating]);

  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGenre('all');
    setSortOrder('rating-desc');
    setPriceRange([0, maxPrice]);
    setSelectedLanguage('all');
    setMinRating(0);
  };


  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">Our Collection</h1>
          <p className="mt-4 text-lg text-muted-foreground">Find your next great read from our curated collection.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title or author..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto"><SlidersHorizontal className="mr-2 h-4 w-4" /> Filters</Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle className="font-headline text-2xl">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="py-8">
                    <FilterControls
                        selectedGenre={selectedGenre}
                        setSelectedGenre={setSelectedGenre}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        minRating={minRating}
                        setMinRating={setMinRating}
                        selectedLanguage={selectedLanguage}
                        setSelectedLanguage={setSelectedLanguage}
                        resetFilters={resetFilters}
                    />
                    </div>
                </SheetContent>
            </Sheet>
            <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full sm:w-[220px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="rating-desc">Highest Rating</SelectItem>
                    <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                    <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-6">{filteredBooks.length} books found</p>
      
      <div className="grid grid-cols-2 gap-6">
        {filteredBooks.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      {filteredBooks.length === 0 && (
        <div className="text-center col-span-full py-16">
          <p className="text-muted-foreground">No books found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}

export default function CollectionPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Collection />
    </React.Suspense>
  );
}