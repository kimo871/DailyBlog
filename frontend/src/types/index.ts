export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface Comment {
  id: string;
  body: string;
  authorId: string;
  author: User;
  postId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  authorId: string;
  author: User;
  tags: Tag[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
