import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { promptsApi } from '../services/api';
import { QueryParams, CreatePromptData, UpdatePromptData } from '../types';
import toast from 'react-hot-toast';

export const usePrompts = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['prompts', params],
    queryFn: () => promptsApi.getPrompts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePrompt = (id: number) => {
  return useQuery({
    queryKey: ['prompt', id],
    queryFn: () => promptsApi.getPrompt(id),
    enabled: !!id,
  });
};

export const usePromptVersions = (id: number) => {
  return useQuery({
    queryKey: ['prompt-versions', id],
    queryFn: () => promptsApi.getPromptVersions(id),
    enabled: !!id,
  });
};

export const usePromptVersion = (id: number, version: number) => {
  return useQuery({
    queryKey: ['prompt-version', id, version],
    queryFn: () => promptsApi.getPromptVersion(id, version),
    enabled: !!id && !!version,
  });
};

export const useCreatePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePromptData) => promptsApi.createPrompt(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      toast.success('Prompt created successfully!');
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.details || 'Failed to create prompt');
    },
  });
};

export const useUpdatePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePromptData }) =>
      promptsApi.updatePrompt(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      queryClient.invalidateQueries({ queryKey: ['prompt', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['prompt-versions', variables.id] });
      toast.success('Prompt updated successfully!');
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.details || 'Failed to update prompt');
    },
  });
};

export const useDeletePrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => promptsApi.deletePrompt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      toast.success('Prompt deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.details || 'Failed to delete prompt');
    },
  });
};

export const useBatchDeletePrompts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => promptsApi.batchDelete(ids),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      toast.success(`Deleted ${response.data?.deleted} prompts successfully!`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.details || 'Failed to delete prompts');
    },
  });
};

export const useExportPrompts = () => {
  return useMutation({
    mutationFn: (params?: QueryParams) => promptsApi.exportPrompts(params),
    onSuccess: (data) => {
      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prompts-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Prompts exported successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.details || 'Failed to export prompts');
    },
  });
};