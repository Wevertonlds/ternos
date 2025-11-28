import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Settings } from '@/types';

const getSettings = async (): Promise<Settings | null> => {
  const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
  
  // .single() throws an error if no row is found (code PGRST116).
  // We can gracefully handle this by returning null, as it's an expected state
  // before any settings are saved for the first time.
  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message);
  }

  return data;
};

export const useSettings = () => {
  return useQuery<Settings | null, Error>({
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