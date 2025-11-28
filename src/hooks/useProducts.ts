import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';

// Helper to upload image
const uploadImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);
  if (uploadError) {
    throw new Error(`Falha no upload da imagem: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
  return data.publicUrl;
};

// Helper to delete image from storage
const deleteImage = async (image_url: string) => {
  if (!image_url) return;
  try {
    const imagePath = new URL(image_url).pathname.split('/product-images/')[1];
    if (imagePath) {
      await supabase.storage.from('product-images').remove([imagePath]);
    }
  } catch (error) {
    console.error("Erro ao deletar imagem antiga:", error);
  }
};

// Fetch all products
const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as Product[];
};

export const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: getProducts,
  });
};

// Add a new product
type AddProductParams = {
  product: Omit<Product, 'id' | 'created_at' | 'image_url'>;
  imageFile: File;
};
const addProduct = async ({ product, imageFile }: AddProductParams) => {
  const image_url = await uploadImage(imageFile);
  const { data, error } = await supabase.from('products').insert([{ ...product, image_url }]).select();
  if (error) {
    // If DB insert fails, try to clean up the uploaded image
    await deleteImage(image_url);
    throw new Error(error.message);
  }
  return data;
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Update a product
type UpdateProductParams = {
  product: Omit<Product, 'created_at'>;
  imageFile?: File;
};
const updateProduct = async ({ product, imageFile }: UpdateProductParams) => {
  let image_url = product.image_url;

  if (imageFile) {
    if (product.image_url) {
      await deleteImage(product.image_url);
    }
    image_url = await uploadImage(imageFile);
  }

  const { id, created_at, ...updates } = { ...product, image_url };
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select();
  if (error) throw new Error(error.message);
  return data;
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Delete a product
const deleteProduct = async (product: Product) => {
  if (product.image_url) {
    await deleteImage(product.image_url);
  }
  const { error } = await supabase.from('products').delete().eq('id', product.id);
  if (error) throw new Error(error.message);
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};