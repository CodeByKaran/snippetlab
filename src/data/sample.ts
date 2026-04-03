export const snippets = [
  {
    id: "1",
    title: "Hello World",
    description: "A simple hello world snippet.",
    code: `console.log('Hello, World!');`,
    language: "javascript",
    tags: ["beginner", "javascript"],
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    category: "General",
    difficulty: "Easy",
    createdBy: "@admin",
  },
  {
    id: "2",
    title: "Debounce Function",
    description: "A debounce utility to limit how often a function fires.",
    code: `function debounce(fn: Function, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}`,
    language: "typescript",
    tags: ["utility", "performance", "typescript"],
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
    category: "Utilities",
    difficulty: "Medium",
    createdBy: "@admin",
  },
  {
    id: "3",
    title: "Flatten Nested Array",
    description: "Recursively flattens a deeply nested array.",
    code: `function flattenArray(arr: any[]): any[] {
  return arr.reduce((acc, val) =>
    Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val), []);
}

// Usage
flattenArray([1, [2, [3, [4]]]]); // [1, 2, 3, 4]`,
    language: "typescript",
    tags: ["array", "recursion", "typescript"],
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-03-05"),
    category: "Arrays",
    difficulty: "Medium",
    createdBy: "@admin",
  },
  {
    id: "4",
    title: "Fetch with Async/Await",
    description: "Basic API fetch using async/await with error handling.",
    code: `async function fetchData(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(\`HTTP error! status: \${response.status}\`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}`,
    language: "typescript",
    tags: ["api", "async", "fetch"],
    createdAt: new Date("2023-03-15"),
    updatedAt: new Date("2023-03-15"),
    category: "Network",
    difficulty: "Easy",
    createdBy: "@admin",
  },
  {
    id: "5",
    title: "useLocalStorage Hook",
    description: "A React hook to sync state with localStorage.",
    code: `import { useState } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue] as const;
}`,
    language: "tsx",
    tags: ["react", "hooks", "localStorage"],
    createdAt: new Date("2023-04-01"),
    updatedAt: new Date("2023-04-01"),
    category: "React Hooks",
    difficulty: "Medium",
    createdBy: "@admin",
  },
  {
    id: "6",
    title: "Deep Clone Object",
    description: "Deep clones a JavaScript object using structuredClone.",
    code: `const original = { name: 'Alice', scores: [10, 20, 30] };
const clone = structuredClone(original);

clone.scores.push(40);
console.log(original.scores); // [10, 20, 30] — untouched
console.log(clone.scores);    // [10, 20, 30, 40]`,
    language: "javascript",
    tags: ["object", "clone", "utility"],
    createdAt: new Date("2023-04-10"),
    updatedAt: new Date("2023-04-10"),
    category: "Utilities",
    difficulty: "Easy",
    createdBy: "@admin",
  },
  {
    id: "7",
    title: "Binary Search",
    description: "Binary search algorithm on a sorted array.",
    code: `function binarySearch(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

// Usage
binarySearch([1, 3, 5, 7, 9], 5); // 2`,
    language: "typescript",
    tags: ["algorithm", "search", "dsa"],
    createdAt: new Date("2023-05-01"),
    updatedAt: new Date("2023-05-01"),
    category: "Algorithms",
    difficulty: "Medium",
    createdBy: "@admin",
  },
  {
    id: "8",
    title: "Throttle Function",
    description:
      "Throttle limits a function to fire at most once per interval.",
    code: `function throttle(fn: Function, limit: number) {
  let lastCall = 0;
  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}`,
    language: "typescript",
    tags: ["utility", "performance", "throttle"],
    createdAt: new Date("2023-05-12"),
    updatedAt: new Date("2023-05-12"),
    category: "Utilities",
    difficulty: "Medium",
    createdBy: "@admin",
  },
  {
    id: "9",
    title: "Group Array by Key",
    description: "Groups an array of objects by a given key.",
    code: `function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const group = String(item[key]);
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

// Usage
const users = [
  { name: 'Alice', role: 'admin' },
  { name: 'Bob', role: 'user' },
  { name: 'Charlie', role: 'admin' },
];
groupBy(users, 'role');
// { admin: [...], user: [...] }`,
    language: "typescript",
    tags: ["array", "utility", "typescript"],
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date("2023-06-01"),
    category: "Arrays",
    difficulty: "Medium",
    createdBy: "@admin",
  },
  {
    id: "10",
    title: "CSS Dark Mode Toggle",
    description:
      "Toggle dark mode by adding/removing a class on the html element.",
    code: `function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// On page load
const saved = localStorage.getItem('theme');
if (saved === 'dark') document.documentElement.classList.add('dark');`,
    language: "javascript",
    tags: ["css", "dark-mode", "dom"],
    createdAt: new Date("2023-06-15"),
    updatedAt: new Date("2023-06-15"),
    category: "CSS",
    difficulty: "Easy",
    createdBy: "@admin",
  },
  {
    id: "11",
    title: "Merge Sort",
    description: "Classic merge sort algorithm implementation in TypeScript.",
    code: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
    language: "typescript",
    tags: ["algorithm", "sorting", "dsa"],
    createdAt: new Date("2023-07-01"),
    updatedAt: new Date("2023-07-01"),
    category: "Algorithms",
    difficulty: "Hard",
    createdBy: "@admin",
  },
  {
    id: "12",
    title: "Copy to Clipboard",
    description: "Copy any text to clipboard using the Clipboard API.",
    code: `async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}`,
    language: "typescript",
    tags: ["browser", "clipboard", "utility"],
    createdAt: new Date("2023-07-10"),
    updatedAt: new Date("2023-07-10"),
    category: "Browser APIs",
    difficulty: "Easy",
    createdBy: "@admin",
  },
  {
    id: "13",
    title: "useFetch Hook",
    description: "A generic React hook to fetch data from any API endpoint.",
    code: `import { useState, useEffect } from 'react';

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}`,
    language: "tsx",
    tags: ["react", "hooks", "fetch", "api"],
    createdAt: new Date("2023-08-01"),
    updatedAt: new Date("2023-08-01"),
    category: "React Hooks",
    difficulty: "Medium",
    createdBy: "@admin",
  },
  {
    id: "14",
    title: "Format Date",
    description: "Format a JavaScript Date object into a readable string.",
    code: `function formatDate(date: Date, locale = 'en-IN'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// Usage
formatDate(new Date()); // "3 April 2026"`,
    language: "typescript",
    tags: ["date", "intl", "formatting"],
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2023-08-15"),
    category: "Utilities",
    difficulty: "Easy",
    createdBy: "@admin",
  },
  {
    id: "15",
    title: "Linked List Implementation",
    description: "A basic singly linked list with insert and print methods.",
    code: `class Node<T> {
  constructor(public value: T, public next: Node<T> | null = null) {}
}

class LinkedList<T> {
  private head: Node<T> | null = null;

  insert(value: T) {
    const node = new Node(value);
    if (!this.head) { this.head = node; return; }
    let curr = this.head;
    while (curr.next) curr = curr.next;
    curr.next = node;
  }

  print() {
    let curr = this.head;
    const result: T[] = [];
    while (curr) { result.push(curr.value); curr = curr.next; }
    console.log(result.join(' -> '));
  }
}`,
    language: "typescript",
    tags: ["dsa", "linked-list", "oop"],
    createdAt: new Date("2023-09-01"),
    updatedAt: new Date("2023-09-01"),
    category: "Data Structures",
    difficulty: "Hard",
    createdBy: "@admin",
  },
  {
    id: "16",
    title: "Random Color Generator",
    description: "Generate a random hex color string.",
    code: `function randomHexColor(): string {
  return '#' + Math.floor(Math.random() * 0xFFFFFF)
    .toString(16)
    .padStart(6, '0');
}

// Usage
randomHexColor(); // e.g. "#a3f2c1"`,
    language: "javascript",
    tags: ["color", "random", "utility"],
    createdAt: new Date("2023-09-10"),
    updatedAt: new Date("2023-09-10"),
    category: "Utilities",
    difficulty: "Easy",
    createdBy: "@admin",
  },
  {
    id: "17",
    title: "Python Fibonacci",
    description: "Generate Fibonacci numbers using a generator in Python.",
    code: `def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

gen = fibonacci()
print([next(gen) for _ in range(10)])
# [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`,
    language: "python",
    tags: ["python", "generator", "fibonacci"],
    createdAt: new Date("2023-10-01"),
    updatedAt: new Date("2023-10-01"),
    category: "Algorithms",
    difficulty: "Medium",
    createdBy: "@admin",
  },
  {
    id: "18",
    title: "SQL Find Duplicates",
    description: "Find duplicate rows in a table based on a column.",
    code: `SELECT email, COUNT(*) as count
FROM users
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY count DESC;`,
    language: "sql",
    tags: ["sql", "database", "duplicates"],
    createdAt: new Date("2023-10-15"),
    updatedAt: new Date("2023-10-15"),
    category: "Database",
    difficulty: "Easy",
    createdBy: "@admin",
  },
  {
    id: "19",
    title: "Intersection Observer",
    description:
      "Detect when an element enters the viewport using Intersection Observer.",
    code: `const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // stop watching after visible
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});`,
    language: "javascript",
    tags: ["browser", "animation", "scroll", "dom"],
    createdAt: new Date("2023-11-01"),
    updatedAt: new Date("2023-11-01"),
    category: "Browser APIs",
    difficulty: "Medium",
    createdBy: "@admin",
  },
  {
    id: "20",
    title: "Zod Schema Validation",
    description: "Validate user input using a Zod schema in TypeScript.",
    code: `import { z } from 'zod';

const UserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be 18 or older'),
});

type User = z.infer<typeof UserSchema>;

const result = UserSchema.safeParse({
  name: 'Alice',
  email: 'alice@example.com',
  age: 25,
});

if (result.success) {
  console.log('Valid user:', result.data);
} else {
  console.error('Errors:', result.error.flatten());
}`,
    language: "typescript",
    tags: ["zod", "validation", "typescript", "schema"],
    createdAt: new Date("2023-11-20"),
    updatedAt: new Date("2023-11-20"),
    category: "Validation",
    difficulty: "Medium",
    createdBy: "@admin",
  },
];
