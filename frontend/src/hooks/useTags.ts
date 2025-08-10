import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagsApi } from '../services/api';
import { QueryParams, CreateTagData } from '../types';
import toast from 'react-hot-toast';

export const useTags = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['tags', params],
    queryFn: () => tagsApi.getTags(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePopularTags = (limit?: number) => {
  return useQuery({
    queryKey: ['popular-tags', limit],
    queryFn: () => tagsApi.getPopularTags(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTag = (id: number) => {
  return useQuery({
    queryKey: ['tag', id],
    queryFn: () => tagsApi.getTag(id),
    enabled: !!id,
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTagData) => tagsApi.createTag(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['popular-tags'] });
      toast.success('Tag created successfully!');
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.details || 'Failed to create tag');
    },
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateTagData }) =>
      tagsApi.updateTag(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['popular-tags'] });
      queryClient.invalidateQueries({ queryKey: ['tag', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['prompts'] }); // Refresh prompts to update tag names
      toast.success('Tag updated successfully!');
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.details || 'Failed to update tag');
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tagsApi.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['popular-tags'] });
      queryClient.invalidateQueries({ queryKey: ['prompts'] }); // Refresh prompts as they may reference deleted tag
      toast.success('Tag deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.details || 'Failed to delete tag');
    },
  });
};