
import random


def makeBook(): return {
    "id": str(random.randint(1, 10000)) + '_s',
    "title": f'Book {random.randint(1, 100)}',
    "categories": ["fiction", "science fiction"],
    "pages": random.randint(1, 1000),
}
