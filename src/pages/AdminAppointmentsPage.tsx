import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MoreHorizontal, Check, X, Clock, MessageCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useAppointments, useBlockedDates, useToggleBlockDate, useUpdateAppointmentStatus } from '@/hooks/useAppointments';
import { Appointment, AppointmentStatus } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const statusConfig: { [key in AppointmentStatus]: { variant: "secondary" | "default" | "destructive", icon: React.ReactNode, label: string } } = {
  Pendente: { variant: 'secondary', icon: <Clock className="mr-1 h-3 w-3" />, label: 'Pendente' },
  Finalizado: { variant: 'default', icon: <Check className="mr-1 h-3 w-3" />, label: 'Finalizado' },
  Cancelado: { variant: 'destructive', icon: <X className="mr-1 h-3 w-3" />, label: 'Cancelado' },
};

const AdminAppointmentsPage = () => {
  const { data: appointments = [], isLoading: isLoadingAppointments } = useAppointments();
  const { data: blockedDates = [], isLoading: isLoadingBlockedDates } = useBlockedDates();
  const toggleBlockDateMutation = useToggleBlockDate();
  const updateStatusMutation = useUpdateAppointmentStatus();
  
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>([]);

  const handleToggleBlockDates = () => {
    if (selectedDates && selectedDates.length > 0) {
      const promises = selectedDates.map(date => toggleBlockDateMutation.mutateAsync(date));
      Promise.all(promises)
        .then(() => {
          toast.success(`${selectedDates.length} dia(s) foram atualizados.`);
          setSelectedDates([]);
        })
        .catch((error) => toast.error(`Erro ao atualizar datas: ${error.message}`));
    }
  };

  const handleUpdateStatus = (id: number, status: AppointmentStatus) => {
    updateStatusMutation.mutate({ id, status }, {
      onSuccess: () => toast.success('Status do agendamento atualizado!'),
      onError: (error) => toast.error(`Erro ao atualizar status: ${error.message}`),
    });
  };

  const isDateBlocked = (d: Date) => blockedDates.some(bd => bd.toDateString() === d.toDateString());

  const getButtonText = () => {
    if (!selectedDates || selectedDates.length === 0) return 'Selecione os dias';
    const allSelectedAreBlocked = selectedDates.every(isDateBlocked);
    if (allSelectedAreBlocked) return `Desbloquear ${selectedDates.length} dia(s)`;
    const noneSelectedAreBlocked = !selectedDates.some(isDateBlocked);
    if (noneSelectedAreBlocked) return `Bloquear ${selectedDates.length} dia(s)`;
    return 'Inverter bloqueio';
  };

  const formatPhoneForLink = (phone: string) => {
    let cleaned = phone.replace(/\D/g, '');
    if ((cleaned.length === 10 || cleaned.length === 11) && !cleaned.startsWith('55')) {
      cleaned = '55' + cleaned;
    }
    return cleaned;
  };

  const { pendingAppointments, pastAppointments } = useMemo(() => {
    const pending: Appointment[] = [];
    const past: Appointment[] = [];

    appointments.forEach(app => {
      if (app.status === 'Pendente') {
        pending.push(app);
      } else {
        past.push(app);
      }
    });

    pending.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { pendingAppointments: pending, pastAppointments: past };
  }, [appointments]);

  const renderAppointmentCard = (app: Appointment) => {
    const whatsappLink = `https://wa.me/${formatPhoneForLink(app.phone)}`;
    
    // Ensure the date from Supabase is parsed as UTC.
    // A `timestamp` column might return '2024-11-29 03:13:00', which `new Date()`
    // would incorrectly interpret as local time. We ensure it's parsed as UTC
    // before converting to the local timezone for display.
    const dateString = app.date.replace(' ', 'T');
    const appointmentDate = new Date(dateString.includes('+') || dateString.endsWith('Z') ? dateString : dateString + 'Z');

    return (
      <Card key={app.id}>
        <CardContent className="p-4 flex flex-col sm:flex-row justify-between">
          <div className="flex-1 mb-4 sm:mb-0">
            <p className="font-bold">{app.name}</p>
            <p className="text-sm text-muted-foreground">{app.address}</p>
            <p className="text-sm text-muted-foreground">WhatsApp: {app.phone}</p>
            <p className="text-sm font-semibold text-brand mt-1">
              {format(appointmentDate, "'Dia' dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
            </p>
            <div className="mt-2">
              <p className="text-xs font-medium mb-1">Itens:</p>
              <div className="flex flex-wrap gap-2">
                {app.fitting_items.map(item => (
                  <div key={item.fittingId} className="flex items-center bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs">
                    {item.name} ({item.selectedSize})
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" title="Conversar no WhatsApp">
              <Button variant="outline" size="icon" className="mr-2 text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </a>
            <Badge variant={statusConfig[app.status].variant} className="mr-2">
              {statusConfig[app.status].icon}
              {statusConfig[app.status].label}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleUpdateStatus(app.id, 'Finalizado')}>Marcar como Finalizado</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus(app.id, 'Cancelado')}>Marcar como Cancelado</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus(app.id, 'Pendente')}>Marcar como Pendente</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold font-display mb-6">Gerenciar Agendamentos</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Próximos Agendamentos</CardTitle>
              <CardDescription>Visualize e gerencie os agendamentos pendentes.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAppointments ? (
                <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>
              ) : (
                <div className="space-y-4">
                  {pendingAppointments.length > 0 ? (
                    pendingAppointments.map(renderAppointmentCard)
                  ) : (
                    <p className="text-muted-foreground text-center py-8">Nenhum agendamento pendente.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Agendamentos</CardTitle>
              <CardDescription>Visualize agendamentos finalizados e cancelados.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAppointments ? (
                <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>
              ) : (
                <div className="space-y-4">
                  {pastAppointments.length > 0 ? (
                    pastAppointments.map(renderAppointmentCard)
                  ) : (
                    <p className="text-muted-foreground text-center py-8">Nenhum agendamento no histórico.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Bloquear Agenda</CardTitle>
              <CardDescription>Selecione um ou mais dias para torná-los indisponíveis.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {isLoadingBlockedDates ? (
                <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>
              ) : (
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={setSelectedDates}
                  className="rounded-md border"
                  locale={ptBR}
                  modifiers={{ blocked: blockedDates }}
                  modifiersStyles={{
                    blocked: { backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))', opacity: 0.8 },
                  }}
                />
              )}
              <Button 
                onClick={handleToggleBlockDates} 
                className="mt-4 w-full"
                disabled={!selectedDates || selectedDates.length === 0 || toggleBlockDateMutation.isPending}
              >
                {toggleBlockDateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {getButtonText()}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointmentsPage;