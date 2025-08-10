import axios from 'axios';
import {
  Prompt,
  Category,
  Tag,
  CreatePromptData,
  UpdatePromptData,
  CreateCategoryData,
  CreateTagData,
  ApiResponse,
  PaginatedResponse,
  PromptsResponse,
  CategoriesResponse,
  QueryParams,
  PromptVersion,
  ExportData
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const promptsApi = {
  // Get all prompts
  getPrompts: async (params?: QueryParams): Promise<PaginatedResponse<PromptsResponse>> => {
    const response = await api.get('/prompts', { params });
    return response.data;
  },

  // Get prompt by ID
  getPrompt: async (id: number): Promise<ApiResponse<Prompt>> => {
    const response = await api.get(`/prompts/${id}`);
    return response.data;
  },

  // Create new prompt
  createPrompt: async (data: CreatePromptData): Promise<ApiResponse<Prompt>> => {
    const response = await api.post('/prompts', data);
    return response.data;
  },

  // Update prompt
  updatePrompt: async (id: number, data: UpdatePromptData): Promise<ApiResponse<Prompt>> => {
    const response = await api.put(`/prompts/${id}`, data);
    return response.data;
  },

  // Delete prompt
  deletePrompt: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/prompts/${id}`);
    return response.data;
  },

  // Get prompt versions
  getPromptVersions: async (id: number): Promise<ApiResponse<PromptVersion[]>> => {
    const response = await api.get(`/prompts/${id}/versions`);
    return response.data;
  },

  // Get specific version
  getPromptVersion: async (id: number, version: number): Promise<ApiResponse<PromptVersion>> => {
    const response = await api.get(`/prompts/${id}/versions/${version}`);
    return response.data;
  },

  // Batch delete prompts
  batchDelete: async (ids: number[]): Promise<ApiResponse<{ requested: number; deleted: number }>> => {
    const response = await api.post('/prompts/batch/delete', { ids });
    return response.data;
  },

  // Export prompts
  exportPrompts: async (params?: QueryParams): Promise<ExportData> => {
    const response = await api.get('/prompts/export/json', { params });
    return response.data;
  },
};

export const categoriesApi = {
  // Get all categories
  getCategories: async (params?: QueryParams): Promise<PaginatedResponse<CategoriesResponse>> => {
    const response = await api.get('/categories', { params });
    return response.data;
  },

  // Get category by ID
  getCategory: async (id: number): Promise<ApiResponse<Category>> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Create new category
  createCategory: async (data: CreateCategoryData): Promise<ApiResponse<Category>> => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  // Update category
  updateCategory: async (id: number, data: CreateCategoryData): Promise<ApiResponse<Category>> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export const tagsApi = {
  // Get all tags
  getTags: async (params?: QueryParams): Promise<ApiResponse<Tag[]>> => {
    const response = await api.get('/tags', { params });
    return response.data;
  },

  // Get popular tags
  getPopularTags: async (limit?: number): Promise<ApiResponse<Tag[]>> => {
    const response = await api.get('/tags/popular', { params: { limit } });
    return response.data;
  },

  // Get tag by ID
  getTag: async (id: number): Promise<ApiResponse<Tag>> => {
    const response = await api.get(`/tags/${id}`);
    return response.data;
  },

  // Create new tag
  createTag: async (data: CreateTagData): Promise<ApiResponse<Tag>> => {
    const response = await api.post('/tags', data);
    return response.data;
  },

  // Update tag
  updateTag: async (id: number, data: CreateTagData): Promise<ApiResponse<Tag>> => {
    const response = await api.put(`/tags/${id}`, data);
    return response.data;
  },

  // Delete tag
  deleteTag: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/tags/${id}`);
    return response.data;
  },
};

export const healthApi = {
  // Health check
  checkHealth: async (): Promise<ApiResponse<{ message: string; timestamp: string }>> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;