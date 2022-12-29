import { faker } from '@faker-js/faker';
import { Book } from './book';

export const createRandomBook = (overrides?: Partial<Book>): Book => ({
  id: faker.random.alphaNumeric(6),
  title: faker.random.words(),
  image: faker.image.imageUrl(),
  description: faker.random.words(10),
  authors: [faker.name.firstName(), faker.name.lastName()],
  published_date: faker.date.past().toISOString(),
  categories: [faker.random.word(), faker.random.word()],
  pages: faker.datatype.number(),
  publisher: faker.company.name(),
  ...overrides,
});

describe('Book', () => {
  it('should create an instance', () => {
    const randomBook = createRandomBook();

    expect(randomBook).toBeTruthy();
  });
});
