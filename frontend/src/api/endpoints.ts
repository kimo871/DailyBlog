// src/api/endpoints.ts
import { API_CONFIG } from './config';

const BASE_URL = API_CONFIG.BASE_URL;

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    ME: `${BASE_URL}/auth/me`,
  },
  
  // Posts
  POSTS: {
    BASE: `${BASE_URL}/posts`,
    BY_ID: (id: string) => `${BASE_URL}/posts/${id}`,
    DRAFT: `${BASE_URL}/posts/draft`,
    PUBLISHED: `${BASE_URL}/posts/published`,
  },
  
   TAGS: {
    BASE: `${BASE_URL}/tags`,
  },
  COMMENTS:{
    BASE : (id: string) => `${BASE_URL}/posts/${id}/comments`,
    BY_COMMENT_ID : (id: string) => `${BASE_URL}/comments/${id}`
  }
} as const;