import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Settings } from '@/types';

const getSettings = async (): Promise<Settings> => {
  const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
  if (error) throw new Error(error.message);
  return data;
};

export const useSettings = () => {
  return useQuery<Settings, Error>({
    queryKey: ['settings'],
    queryFn: getSettings,
    staleTime: Infinity, // Settings don't change often
  });
};

const updateSettings = async (settings: Omit<Settings, 'id'>) => {
  const { data, error } = await supabase
    .from('settings')
    .upsert({ id: 1, ...settings })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};