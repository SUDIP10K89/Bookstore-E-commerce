export type Review = {
    id: string;
    bookId: string;
    author: string;
    avatarUrl: string;
    rating: number;
    date: string;
    comment: string;
};

export const mockReviews: Review[] = [
    {
        id: 'review-1-1',
        bookId: '1',
        author: 'Sarah J.',
        avatarUrl: 'https://i.pravatar.cc/150?u=sarah-j',
        rating: 5,
        date: '2023-10-15',
        comment: 'An absolute masterpiece. The characters are unforgettable and the story is deeply moving. A must-read for everyone.',
    },
    {
        id: 'review-1-2',
        bookId: '1',
        author: 'Michael B.',
        avatarUrl: 'https://i.pravatar.cc/150?u=michael-b',
        rating: 5,
        date: '2023-09-22',
        comment: 'This book changed my perspective on so many things. Harper Lee\'s writing is powerful and timeless. I couldn\'t put it down.',
    },
    {
        id: 'review-1-3',
        bookId: '1',
        author: 'Emily K.',
        avatarUrl: 'https://i.pravatar.cc/150?u=emily-k',
        rating: 4,
        date: '2023-08-01',
        comment: 'A truly important book. It took me a while to get into it, but I\'m so glad I stuck with it. The lessons are invaluable.',
    },
    {
        id: 'review-2-1',
        bookId: '2',
        author: 'David L.',
        avatarUrl: 'https://i.pravatar.cc/150?u=david-l',
        rating: 5,
        date: '2023-11-01',
        comment: 'Chilling, prophetic, and more relevant than ever. Orwell was a visionary. This book is a stark warning that everyone should heed.',
    },
    {
        id: 'review-2-2',
        bookId: '2',
        author: 'Jessica P.',
        avatarUrl: 'https://i.pravatar.cc/150?u=jessica-p',
        rating: 4,
        date: '2023-10-18',
        comment: 'A difficult but necessary read. It\'s a bit dense at times, but the concepts are fascinating and terrifying. Stick with it.',
    },
    {
        id: 'review-7-1',
        bookId: '7',
        author: 'Chris W.',
        avatarUrl: 'https://i.pravatar.cc/150?u=chris-w',
        rating: 5,
        date: '2023-11-10',
        comment: 'The world-building is second to none. Dune is a universe you can get lost in. Complex, political, and epic in scope. A sci-fi classic for a reason.'
    },
     {
        id: 'review-7-2',
        bookId: '7',
        author: 'Laura D.',
        avatarUrl: 'https://i.pravatar.cc/150?u=laura-d',
        rating: 5,
        date: '2023-10-25',
        comment: 'I\'ve read this book multiple times and I discover something new with each reading. The layers of philosophy, religion, and ecology are incredible.'
    },
     {
        id: 'review-6-1',
        bookId: '6',
        author: 'Bilbo B.',
        avatarUrl: 'https://i.pravatar.cc/150?u=bilbo-b',
        rating: 5,
        date: '2023-01-01',
        comment: 'A perfect adventure! Tolkien\'s world is so enchanting. It\'s a wonderful story for all ages, full of charm and wit.'
    }
];
