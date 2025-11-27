import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, MoreHorizontal, Check, X, Clock } from 'lucide-react';

import { useScheduling, Appointment, AppointmentStatus } from '@/contexts/SchedulingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const statusConfig: { [key in AppointmentStatus]: { variant: "secondary" | "default" | "destructive", icon: React.ReactNode, label: string } } = {
  Pendente: { variant: 'secondary', icon: <Clock className="mr-1 h-3 w-3" />, label: 'Pendente' },
  Finalizado: { variant: 'default', icon: <Check className="mr-1 h-3 w-3" />, label: 'Finalizado' },
  Cancelado: { variant: 'destructive', icon: <X className="mr-1 h-3 w-3" />, label: 'Cancelado' },
};

const AdminAppointmentsPage = () => {
  const { appointments, blockedDates, toggleBlockDate, updateAppointmentStatus } = useScheduling();
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>([]);

  const handleToggleBlockDates = () => {
    if (selectedDates && selectedDates.length > 0) {
      selectedDates.forEach(date => {
        toggleBlockDate(date);
      });
      setSelectedDates([]); // Limpa a seleção após a ação
    }
  };

  const isDateBlocked = (d: Date) => blockedDates.some(bd => bd.toDateString() === d.toDateString());

  const getButtonText = () => {
    if (!selectedDates || selectedDates.length === 0) {
      return 'Selecione os dias';
    }
    const allSelectedAreBlocked = selectedDates.every(isDateBlocked);
    if (allSelectedAreBlocked) {
      return `Desbloquear ${selectedDates.length} dia(s)`;
    }
    const noneSelectedAreBlocked = !selectedDates.some(isDateBlocked);
    if (noneSelectedAreBlocked) {
      return `Bloquear ${selectedDates.length} dia(s)`;
    }
    return 'Inverter bloqueio dos dias selecionados';
  };

  return (
    <div>
      <h1 className="text-3xl font-bold font-display mb-6">Gerenciar Agendamentos</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Próximos Agendamentos</CardTitle>
              <CardDescription>Visualize e gerencie os agendamentos dos seus clientes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.length > 0 ? (
                  appointments
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((app) => (
                      <Card key={app.id}>
                        <CardContent className="p-4 flex flex-col sm:flex-row justify-between">
                          <div className="flex-1 mb-4 sm:mb-0">
                            <p className="font-bold">{app.name}</p>
                            <p className="text-sm text-muted-foreground">{app.address}</p>
                            <p className="text-sm font-semibold text-brand mt-1">
                              {format(app.date, "'Dia' dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                            </p>
                            <div className="mt-2">
                              <p className="text-xs font-medium mb-1">Itens:</p>
                              <div className="flex flex-wrap gap-2">
                                {app.fittingItems.map(item => (
                                  <div key={item.fittingId} className="flex items-center bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs">
                                    {item.name} ({item.selectedSize})
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Badge variant={statusConfig[app.status].variant} className="mr-2">
                              {statusConfig[app.status].icon}
                              {statusConfig[app.status].label}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => updateAppointmentStatus(app.id, 'Finalizado')}>Marcar como Finalizado</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateAppointmentStatus(app.id, 'Cancelado')}>Marcar como Cancelado</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateAppointmentStatus(app.id, 'Pendente')}>Marcar como Pendente</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">Nenhum agendamento encontrado.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Bloquear Agenda</CardTitle>
              <CardDescription>Selecione um ou mais dias no calendário para torná-los indisponíveis para agendamento.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={setSelectedDates}
                className="rounded-md border"
                locale={ptBR}
                modifiers={{ blocked: blockedDates }}
                modifiersStyles={{
                  blocked: {
                    backgroundColor: 'hsl(var(--destructive))',
                    color: 'hsl(var(--destructive-foreground))',
                    opacity: 0.8,
                  },
                }}
              />
              <Button 
                onClick={handleToggleBlockDates} 
                className="mt-4 w-full"
                disabled={!selectedDates || selectedDates.length === 0}
              >
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