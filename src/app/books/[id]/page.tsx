'use client';
import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { Book, books } from '@/lib/books';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, StarHalf } from 'lucide-react';
import { Recommendations } from '@/components/recommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockReviews, Review } from '@/lib/reviews';
import { AddReviewForm } from '@/components/add-review-form';

function getBookById(id: string): Book | undefined {
  return books.find(book => book.id === id);
}

const AddToCartButton = ({ book }: { book: Book }) => {
  const { addToCart } = useCart();
  return (
    <Button size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => addToCart(book)}>
      Add to Cart
    </Button>
  );
};

const BrowsingHistoryTracker = ({ bookId }: { bookId: string }) => {
    useEffect(() => {
        try {
            const history = JSON.parse(localStorage.getItem('browsingHistory') || '[]');
            const updatedHistory = [bookId, ...history.filter((id: string) => id !== bookId)].slice(0, 10);
            localStorage.setItem('browsingHistory', JSON.stringify(updatedHistory));
        } catch (error) {
            console.error('Could not update browsing history:', error);
        }
    }, [bookId]);

    return null;
}

const ReviewsSection = ({ book }: { book: Book }) => {
    const [reviews, setReviews] = useState<Review[]>(mockReviews.filter(review => review.bookId === book.id));
    const [showReviewForm, setShowReviewForm] = useState(false);

    const handleReviewSubmit = (data: { rating: number; comment: string }) => {
        const newReview: Review = {
            id: `review-${book.id}-${Date.now()}`,
            bookId: book.id,
            author: 'Alex Doe', // Placeholder for logged-in user
            avatarUrl: 'https://i.pravatar.cc/150?u=alex-doe',
            rating: data.rating,
            comment: data.comment,
            date: new Date().toISOString().split('T')[0],
        };
        setReviews(prevReviews => [newReview, ...prevReviews]);
        setShowReviewForm(false);
        console.log('New review submitted:', newReview);
        // Here you would typically call a server action to save the review
    };
    
    return (
        <div className="mt-16">
            <h2 className="text-3xl font-bold font-headline mb-8">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Reviews</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {reviews.length > 0 ? (
                                <div className="space-y-8">
                                    {reviews.map(review => (
                                        <div key={review.id} className="flex gap-4">
                                            <Avatar>
                                                <AvatarImage src={review.avatarUrl} />
                                                <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold">{review.author}</p>
                                                    <span className="text-xs text-muted-foreground">{review.date}</span>
                                                </div>
                                                <div className="flex items-center gap-0.5 mt-1">
                                                    {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
                                                    {[...Array(5-review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-muted-foreground/30" />)}
                                                </div>
                                                <p className="text-foreground/80 mt-2 leading-relaxed">{review.comment}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No reviews yet. Be the first to write one!</p>
                            )}
                        </CardContent>
                    </Card>
                    {!showReviewForm && (
                        <div className="text-center">
                            <Button onClick={() => setShowReviewForm(true)}>Write a Review</Button>
                        </div>
                    )}
                </div>
                <div>
                    {showReviewForm && <AddReviewForm onSubmit={handleReviewSubmit} />}
                </div>
            </div>
        </div>
    )
}

export default function BookDetailPage() {
  const params = useParams();
  const bookId = typeof params.id === 'string' ? params.id : '';
  const book = getBookById(bookId);

  if (!book) {
    notFound();
  }
  
  const fullStars = Math.floor(book.rating);
  const halfStar = book.rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-16">
        <BrowsingHistoryTracker bookId={book.id} />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-1 flex justify-center">
            <Image
              src={book.coverImage}
              alt={`Cover of ${book.title}`}
              width={400}
              height={600}
              className="rounded-lg shadow-2xl object-cover aspect-[2/3]"
              data-ai-hint="book cover"
            />
          </div>
          <div className="lg:col-span-2">
            <h1 className="text-4xl md:text-5xl font-bold font-headline leading-tight">
              {book.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mt-2">
              by {book.author}
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center">
                {[...Array(fullStars)].map((_, i) => (
                  <Star key={`full-${i}`} className="w-5 h-5 fill-primary text-primary" />
                ))}
                {halfStar && <StarHalf className="w-5 h-5 fill-primary text-primary" />}
                {[...Array(emptyStars)].map((_, i) => (
                  <Star key={`empty-${i}`} className="w-5 h-5 text-muted-foreground/50" />
                ))}
              </div>
              <span className="text-muted-foreground">({book.rating} rating)</span>
            </div>
            <p className="text-4xl font-bold mt-6">${book.price.toFixed(2)}</p>
            <div className="flex items-center gap-4 mt-6">
              <AddToCartButton book={book} />
            </div>
            <Separator className="my-8" />
            <h2 className="text-2xl font-bold font-headline mb-4">Description</h2>
            <p className="text-foreground/80 leading-relaxed">{book.description}</p>
            <div className="mt-6">
              <Badge>{book.genre}</Badge>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className='lg:col-span-3'>
                <Separator className="mb-12" />
                <h2 className="text-2xl font-bold font-headline mb-4">Book Details</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="font-semibold">Language</p>
                        <p className="text-muted-foreground">{book.language}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Publisher</p>
                        <p className="text-muted-foreground">LiteraryLane Press</p>
                    </div>
                    <div>
                        <p className="font-semibold">Publication Year</p>
                        <p className="text-muted-foreground">{book.publishedYear}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Pages</p>
                        <p className="text-muted-foreground">{book.pages}</p>
                    </div>
                    <div>
                        <p className="font-semibold">ISBN</p>
                        <p className="text-muted-foreground">{book.isbn}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Availability</p>
                        <p className="text-green-600 dark:text-green-400">{book.stock > 0 ? `In Stock (${book.stock})` : 'Out of Stock'}</p>
                    </div>
                </div>
            </div>
        </div>
        <ReviewsSection book={book} />
      </div>
      <Recommendations currentBookId={book.id} />
    </>
  );
}
