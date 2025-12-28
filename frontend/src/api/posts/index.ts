import apiClient from "../../lib/axios/client";
import { ENDPOINTS } from "../endpoints";

export const postsService = {
  getPosts: async () => {
    return apiClient.get(ENDPOINTS.POSTS.BASE);
  },

  getPostById: async (id: string) => {
    return apiClient.get(ENDPOINTS.POSTS.BY_ID(id));
  },

  createPost: async (postData: any) => {
    const response = await apiClient.post(ENDPOINTS.POSTS.BASE, postData);
    return response;
  },

  updatePost: async (id: string, postData: any) => {
    const response = await apiClient.patch(ENDPOINTS.POSTS.BY_ID(id), postData);
    return response;
  },

  deletePost: async (id: string) => {
    const response = await apiClient.delete(ENDPOINTS.POSTS.BY_ID(id));
    return response;
  },
};
