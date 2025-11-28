import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Banner } from '@/types';

// Fetch all banners
const getBanners = async (): Promise<Banner[]> => {
  const { data, error } = await supabase.from('banners').select('*').order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data as Banner[];
};

export const useBanners = () => {
  return useQuery<Banner[], Error>({
    queryKey: ['banners'],
    queryFn: getBanners,
  });
};

// Add a new banner
const addBanner = async (banner: Omit<Banner, 'id' | 'created_at'>) => {
  const { data, error } = await supabase.from('banners').insert([banner]).select();
  if (error) throw new Error(error.message);
  return data;
};

export const useAddBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
};

// Update a banner
const updateBanner = async (banner: Omit<Banner, 'created_at'>) => {
  const { id, ...updates } = banner;
  const { data, error } = await supabase.from('banners').update(updates).eq('id', id).select();
  if (error) throw new Error(error.message);
  return data;
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
};

// Delete a banner
const deleteBanner = async (id: number) => {
  const { error } = await supabase.from('banners').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
};