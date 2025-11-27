import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useFittingRoom } from '@/contexts/FittingRoomContext';
import { cn } from '@/lib/utils';

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  phone: z.string().min(10, { message: 'Por favor, insira um telefone válido.' }),
  address: z.string().min(10, { message: 'Por favor, insira um endereço completo.' }),
  date: z.date({
    required_error: 'A data do agendamento é obrigatória.',
  }),
});

const SchedulingModal: React.FC<SchedulingModalProps> = ({ isOpen, onClose }) => {
  const { fittingItems, removeFittingItem } = useFittingRoom();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log({
      ...values,
      fittingItems,
    });
    toast.success('Agendamento realizado com sucesso!', {
      description: `Entraremos em contato para confirmar sua visita em ${format(values.date, 'PPP', { locale: ptBR })}.`,
    });
    onClose();
    form.reset();
  };

  const handleNavigateToProducts = () => {
    onClose();
    navigate('/products');
  };

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
                      <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-md mr-3" />
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
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                            initialFocus
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      <FormLabel>Telefone</FormLabel>
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
                <DialogFooter>
                  <Button type="submit" className="w-full">
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