import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Appointment, AppointmentStatus, FittingItem } from '@/types';

// APPOINTMENTS

const getAppointments = async (): Promise<Appointment[]> => {
  const { data, error } = await supabase.from('appointments').select('*').order('date', { ascending: true });
  if (error) throw new Error(error.message);
  return data as Appointment[];
};

export const useAppointments = () => {
  return useQuery<Appointment[], Error>({
    queryKey: ['appointments'],
    queryFn: getAppointments,
  });
};

interface NewAppointmentData {
  name: string;
  phone: string;
  address: string;
  date: Date;
  fitting_items: FittingItem[];
}

const addAppointment = async (appointmentData: NewAppointmentData) => {
  const { data, error } = await supabase.from('appointments').insert([appointmentData]);
  if (error) throw new Error(error.message);
  return data;
};

export const useAddAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

const updateAppointmentStatus = async ({ id, status }: { id: number; status: AppointmentStatus }) => {
  const { data, error } = await supabase.from('appointments').update({ status }).eq('id', id).select();
  if (error) throw new Error(error.message);
  return data;
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAppointmentStatus,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

// BLOCKED DATES

interface BlockedDate {
  date: string;
}

const getBlockedDates = async (): Promise<Date[]> => {
  const { data, error } = await supabase.from('blocked_dates').select('date');
  if (error) throw new Error(error.message);
  // Supabase returns { date: 'YYYY-MM-DD' }[], convert to Date objects in UTC to avoid timezone issues
  return data.map((d: BlockedDate) => {
    const [year, month, day] = d.date.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  });
};

export const useBlockedDates = () => {
  return useQuery<Date[], Error>({
    queryKey: ['blocked_dates'],
    queryFn: getBlockedDates,
  });
};

const toggleBlockDate = async (date: Date) => {
  // Format to YYYY-MM-DD, ensuring UTC context
  const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
    .toISOString()
    .split("T")[0];

  const { data: existing } = await supabase.from('blocked_dates').select('date').eq('date', dateString);

  if (existing && existing.length > 0) {
    const { error } = await supabase.from('blocked_dates').delete().eq('date', dateString);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from('blocked_dates').insert({ date: dateString });
    if (error) throw new Error(error.message);
  }
};

export const useToggleBlockDate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleBlockDate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked_dates'] });
    },
  });
};