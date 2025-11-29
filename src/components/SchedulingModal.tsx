import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useFittingRoom } from '@/contexts/FittingRoomContext';
import { useAddAppointment, useBlockedDates, useAppointments } from '@/hooks/useAppointments';
import { cn } from '@/lib/utils';
import { Appointment } from '@/types';

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Schema base sem a validação que depende de dados externos
const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  phone: z.string().min(10, { message: 'Por favor, insira um telefone válido.' }),
  address: z.string().min(10, { message: 'Por favor, insira um endereço completo.' }),
  date: z.date({
    required_error: 'A data do agendamento é obrigatória.',
  }),
  time: z.string().min(1, { message: 'O horário é obrigatório.' }),
});

// Função que cria o schema completo com a validação dinâmica
const getValidationSchema = (appointments: Appointment[]) => {
  return formSchema.superRefine((data, ctx) => {
    if (!data.date || !data.time) {
      return; // Deixa a validação de campos individuais tratar isso
    }
    
    const [hour, minute] = data.time.split(':').map(Number);
    const selectedDateTime = new Date(data.date);
    selectedDateTime.setHours(hour, minute, 0, 0);

    const isBooked = appointments.some(app => 
      app.status === 'Pendente' && new Date(app.date).getTime() === selectedDateTime.getTime()
    );

    if (isBooked) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Este horário já está agendado. Que tal tentar no dia seguinte?',
        path: ['time'],
      });
    }
  });
};

const SchedulingModal: React.FC<SchedulingModalProps> = ({ isOpen, onClose }) => {
  const { fittingItems, removeFittingItem, clearFittingRoom } = useFittingRoom();
  const { data: blockedDates = [], isLoading: isLoadingBlockedDates } = useBlockedDates();
  const { data: appointments = [], isLoading: isLoadingAppointments } = useAppointments();
  const addAppointmentMutation = useAddAppointment();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: async (data, context, options) => {
      const validationSchema = getValidationSchema(appointments);
      return zodResolver(validationSchema)(data, context, options);
    },
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      time: '',
    },
    mode: 'onChange', // Valida em tempo real
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const [hour, minute] = values.time.split(':').map(Number);
    const combinedDateTime = new Date(values.date);
    combinedDateTime.setHours(hour, minute, 0, 0);

    addAppointmentMutation.mutate({
      name: values.name,
      phone: values.phone,
      address: values.address,
      date: combinedDateTime,
      fitting_items: fittingItems,
    }, {
      onSuccess: () => {
        toast.success('Agendamento realizado com sucesso!', {
          description: `Entraremos em contato para confirmar sua visita em ${format(combinedDateTime, "PPP 'às' HH:mm", { locale: ptBR })}.`,
        });
        onClose();
        form.reset();
        clearFittingRoom();
      },
      onError: (error) => {
        toast.error(`Erro ao agendar: ${error.message}`);
      }
    });
  };

  const handleNavigateToProducts = () => {
    onClose();
    navigate('/products');
  };

  const isLoading = isLoadingBlockedDates || isLoadingAppointments;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {fittingItems.length > 0 ? (
          <>
            <DialogHeader>
              <DialogTitle>Agende sua visita</DialogTitle>
              <DialogDescription>
                Selecione uma data, preencha seus dados e receba nosso estilista onde preferir.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <h4 className="font-semibold mb-2">Itens para provar:</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {fittingItems.map((item) => (
                  <div key={item.fittingId} className="flex items-center justify-between bg-muted p-2 rounded-md">
                    <div className="flex items-center">
                      <img src={item.image_url} alt={item.name} className="w-12 h-12 object-cover rounded-md mr-3" />
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.brand} - Tamanho: {item.selectedSize}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFittingItem(item.fittingId)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <fieldset disabled={isLoading} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data da visita</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP', { locale: ptBR })
                                  ) : (
                                    <span>Escolha uma data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              {isLoadingBlockedDates ? (
                                <div className="flex justify-center items-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
                              ) : (
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date(new Date().setDate(new Date().getDate() - 1)) ||
                                    blockedDates.some(d => d.toDateString() === date.toDateString())
                                  }
                                  initialFocus
                                  locale={ptBR}
                                />
                              )}
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="(XX) XXXXX-XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input placeholder="Rua, número, bairro, cidade..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </fieldset>
                <DialogFooter>
                  <Button type="submit" className="w-full" disabled={addAppointmentMutation.isPending || isLoading}>
                    {(addAppointmentMutation.isPending || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirmar Agendamento
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Selecione seus produtos</DialogTitle>
              <DialogDescription>
                Para agendarmos o melhor momento, primeiro escolha as peças que deseja provar.
              </DialogDescription>
            </DialogHeader>
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-6">É o primeiro passo para uma experiência de estilo única.</p>
              <Button onClick={handleNavigateToProducts}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Ver Coleção
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SchedulingModal;