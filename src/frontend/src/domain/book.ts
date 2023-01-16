export interface Book {
  id: string;
  title: string;
  description: string;
  image: string;
  authors: string[];
  categories: string[];
  published_date: string;
  publisher: string;
  pages: number;
}

export interface MarkBook {
  id: string;
  title: string;
  categories: string[];
  pages: number;
}

export const markBook = (book: Book): MarkBook => {
  const { id, title, categories, pages } = book;
  return {
    id,
    title,
    categories,
    pages,
  };
};
