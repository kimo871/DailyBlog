import type { Post, Tag, User } from "../types";


export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date('2024-03-10'),
  },
];

export const mockTags: Tag[] = [
  { id: '1', name: 'Technology', color: 'hsl(25 95% 53%)' },
  { id: '2', name: 'Design', color: 'hsl(280 70% 50%)' },
  { id: '3', name: 'Programming', color: 'hsl(200 80% 45%)' },
  { id: '4', name: 'Lifestyle', color: 'hsl(142 76% 36%)' },
  { id: '5', name: 'Business', color: 'hsl(38 92% 50%)' },
  { id: '6', name: 'Science', color: 'hsl(320 70% 50%)' },
];

const createExpirationDate = (hoursFromNow: number) => {
  const date = new Date();
  date.setHours(date.getHours() + hoursFromNow);
  return date;
};

export const mockComments: Comment[] = [
  {
    id: '1',
    body: 'Great article! I learned a lot from this.',
    authorId: '2',
    author: mockUsers[1],
    postId: '1',
    createdAt: new Date('2024-12-21T10:30:00'),
    updatedAt: new Date('2024-12-21T10:30:00'),
  },
  {
    id: '2',
    body: 'This is exactly what I was looking for. Thanks for sharing!',
    authorId: '3',
    author: mockUsers[2],
    postId: '1',
    createdAt: new Date('2024-12-21T14:15:00'),
    updatedAt: new Date('2024-12-21T14:15:00'),
  },
  {
    id: '3',
    body: 'Could you elaborate more on the second point? I found it particularly interesting.',
    authorId: '1',
    author: mockUsers[0],
    postId: '2',
    createdAt: new Date('2024-12-21T09:00:00'),
    updatedAt: new Date('2024-12-21T09:00:00'),
  },
];

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'The Future of Web Development: Trends to Watch in 2025',
    body: `The web development landscape is constantly evolving, and 2025 promises to bring even more exciting changes. From AI-powered development tools to new frameworks that prioritize performance and developer experience, there's a lot to be excited about.

## Key Trends

### 1. AI-Assisted Development
AI tools are becoming more sophisticated, helping developers write better code faster. From intelligent code completion to automated testing, AI is transforming how we build applications.

### 2. Edge Computing
Moving computation closer to users reduces latency and improves performance. Edge functions and distributed databases are becoming the norm.

### 3. WebAssembly Maturity
WASM is finally reaching its full potential, enabling high-performance applications in the browser that were previously impossible.

## Looking Ahead

As we move into 2025, staying updated with these trends will be crucial for any developer looking to remain competitive in the field.`,
    authorId: '1',
    author: mockUsers[0],
    tags: [mockTags[0], mockTags[2]],
    comments: [mockComments[0], mockComments[1]],
    createdAt: new Date('2024-12-21T08:00:00'),
    updatedAt: new Date('2024-12-21T08:00:00'),
    expiresAt: createExpirationDate(18),
  },
  {
    id: '2',
    title: 'Designing for Accessibility: A Comprehensive Guide',
    body: `Accessibility in design isn't just about compliance—it's about creating experiences that everyone can enjoy. This guide covers the fundamentals of accessible design and practical tips for implementation.

## Why Accessibility Matters

Over 1 billion people worldwide have some form of disability. By designing accessibly, we ensure that our products can be used by the widest possible audience.

## Core Principles

### Perceivable
Information must be presentable in ways users can perceive. This includes providing text alternatives for images and captions for videos.

### Operable
Users must be able to operate the interface. This means keyboard navigation and giving users enough time to read content.

### Understandable
Information and UI operation must be understandable. Use clear language and predictable navigation.

### Robust
Content must be robust enough to be interpreted by various user agents, including assistive technologies.`,
    authorId: '2',
    author: mockUsers[1],
    tags: [mockTags[1], mockTags[0]],
    comments: [mockComments[2]],
    createdAt: new Date('2024-12-20T14:00:00'),
    updatedAt: new Date('2024-12-20T14:00:00'),
    expiresAt: createExpirationDate(6),
  },
  {
    id: '3',
    title: 'Building Sustainable Tech Habits for Long-term Success',
    body: `In the fast-paced world of technology, it's easy to burn out. This article explores how to build sustainable habits that will help you thrive in your tech career for years to come.

## The Problem with Hustle Culture

Many tech professionals feel pressure to constantly learn, code, and produce. While dedication is admirable, unsustainable work patterns lead to burnout.

## Sustainable Strategies

### Set Boundaries
Define clear work hours and stick to them. Your brain needs rest to be productive.

### Continuous Learning, Sustainable Pace
Instead of cramming, dedicate small amounts of time regularly to learning new skills.

### Take Care of Your Health
Regular exercise, proper sleep, and healthy eating directly impact your cognitive performance.

## Building Your Personal System

Create routines that work for you. What matters is consistency, not intensity.`,
    authorId: '3',
    author: mockUsers[2],
    tags: [mockTags[3], mockTags[4]],
    comments: [],
    createdAt: new Date('2024-12-21T16:00:00'),
    updatedAt: new Date('2024-12-21T16:00:00'),
    expiresAt: createExpirationDate(22),
  },
  {
    id: '4',
    title: 'Understanding React Server Components',
    body: `React Server Components represent a paradigm shift in how we build React applications. This deep dive explores what they are, how they work, and when to use them.

## What Are Server Components?

Server Components are React components that render on the server and stream to the client. Unlike traditional SSR, they don't hydrate on the client, reducing bundle size.

## Benefits

### Smaller Bundle Sizes
Server Components never ship JavaScript to the client, dramatically reducing bundle size.

### Direct Backend Access
Access databases, file systems, and internal services directly without API layers.

### Automatic Code Splitting
The framework automatically code-splits based on component boundaries.

## When to Use Them

Use Server Components for static content, data fetching, and accessing backend resources. Use Client Components for interactivity.`,
    authorId: '1',
    author: mockUsers[0],
    tags: [mockTags[2], mockTags[0]],
    comments: [],
    createdAt: new Date('2024-12-21T12:00:00'),
    updatedAt: new Date('2024-12-21T12:00:00'),
    expiresAt: createExpirationDate(12),
  },
];
