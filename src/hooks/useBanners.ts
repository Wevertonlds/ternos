import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Banner } from '@/types';

// Helper to upload image
const uploadImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage.from('banner-images').upload(filePath, file);
  if (uploadError) {
    throw new Error(`Falha no upload da imagem: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from('banner-images').getPublicUrl(filePath);
  return data.publicUrl;
};

// Helper to delete image from storage
const deleteImage = async (imageUrl: string) => {
  if (!imageUrl) return;
  try {
    const imagePath = new URL(imageUrl).pathname.split('/banner-images/')[1];
    if (imagePath) {
      await supabase.storage.from('banner-images').remove([imagePath]);
    }
  } catch (error) {
    console.error("Erro ao deletar imagem antiga do banner:", error);
  }
};

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
type AddBannerParams = {
  banner: Omit<Banner, 'id' | 'created_at' | 'imageUrl'>;
  imageFile: File;
};
const addBanner = async ({ banner, imageFile }: AddBannerParams) => {
  const imageUrl = await uploadImage(imageFile);
  const { data, error } = await supabase.from('banners').insert([{ ...banner, imageUrl }]).select();
  if (error) {
    await deleteImage(imageUrl);
    throw new Error(error.message);
  }
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
type UpdateBannerParams = {
  banner: Omit<Banner, 'created_at'>;
  imageFile?: File;
};
const updateBanner = async ({ banner, imageFile }: UpdateBannerParams) => {
  let imageUrl = banner.imageUrl;

  if (imageFile) {
    if (banner.imageUrl) {
      await deleteImage(banner.imageUrl);
    }
    imageUrl = await uploadImage(imageFile);
  }

  const { id, ...updates } = { ...banner, imageUrl };
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
const deleteBanner = async (banner: Banner) => {
  if (banner.imageUrl) {
    await deleteImage(banner.imageUrl);
  }
  const { error } = await supabase.from('banners').delete().eq('id', banner.id);
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