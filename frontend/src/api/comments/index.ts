
import apiClient from '../../lib/axios/client';
import { ENDPOINTS } from '../endpoints';

export const commentsService = {
  createComment: async (id:string,comment: { body: string; }) => {
    return apiClient.post(ENDPOINTS.COMMENTS.BASE(id), JSON.stringify(comment));
  },
  editComment : async (id:string,comment: { body: string; }) => {
    return apiClient.put(ENDPOINTS.COMMENTS.BY_COMMENT_ID(id), JSON.stringify(comment));
  },
  deleteComment : async(id:string)=>{
    return apiClient.delete(ENDPOINTS.COMMENTS.BY_COMMENT_ID(id));
  }

};