import axios from "axios";
import type { Photo, Comment, PhotoWithComments } from "@/lib/db";
import { API_ENDPOINTS } from "@/constants/api-constants";

const api = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiService = {
  getPhotos: async (refreshKey?: number) => {
    const response = await api.get<{ photos: PhotoWithComments[] }>(
      API_ENDPOINTS.PHOTOS,
      {
        params: { refresh: refreshKey },
      },
    );
    return response.data;
  },

  uploadPhotos: async (formData: FormData) => {
    const response = await api.post<{ photos: Photo[] }>(
      API_ENDPOINTS.UPLOAD,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  addComment: async (commentData: {
    photoId: number;
    content: string;
    author: string;
  }) => {
    const response = await api.post<{ comment: Comment }>(
      API_ENDPOINTS.COMMENTS,
      commentData,
    );
    return response.data;
  },
};
