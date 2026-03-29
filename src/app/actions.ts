'use server';

import {
  getBookRecommendations,
  PersonalizedBookRecommendationsInput,
} from '@/ai/flows/personalized-book-recommendations';
import { books } from '@/lib/books';

export async function getRecommendationsAction(
  input: PersonalizedBookRecommendationsInput
) {
  try {
    // Prevent calling AI if there's no history to base recommendations on.
    if (!input.browsingHistory || input.browsingHistory.length === 0) {
      return [];
    }
    
    const result = await getBookRecommendations(input);
    
    // Map recommended titles back to full book objects
    const recommendedBooks = result.recommendations
      .map(title => books.find(book => book.title === title))
      .filter((book): book is NonNullable<typeof book> => book !== undefined);

    return recommendedBooks;

  } catch (error) {
    console.error('Error getting recommendations:', error);
    // Return an empty array or handle the error as appropriate for your application
    return [];
  }
}
