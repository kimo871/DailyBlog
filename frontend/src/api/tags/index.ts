import apiClient from "../../lib/axios/client";
import { ENDPOINTS } from "../endpoints";

export const tagsService = {
  getTags: async () => {
    return apiClient.get(ENDPOINTS.TAGS.BASE);
  },
};
