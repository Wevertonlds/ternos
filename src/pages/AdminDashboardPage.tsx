import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Settings, Image, Package, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScheduling } from '@/contexts/SchedulingContext';

const AdminDashboardPage = () => {
  const { appointments } = useScheduling();

  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(a => a.status === 'Pendente').length;
  const finishedAppointments = appointments.filter(a => a.status === 'Finalizado').length;
  const canceledAppointments = appointments.filter(a => a.status === 'Cancelado').length;

  return (
    <div>
      <h1 className="text-3xl font-bold font-display mb-6">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Totais</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppointments}</div>
            <p className="text-xs text-muted-foreground">Total de agendamentos recebidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAppointments}</div>
            <p className="text-xs text-muted-foreground">Aguardando atendimento</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finalizados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{finishedAppointments}</div>
            <p className="text-xs text-muted-foreground">Atendimentos concluídos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelados</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{canceledAppointments}</div>
            <p className="text-xs text-muted-foreground">Agendamentos cancelados</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo ao Painel de Gestão</CardTitle>
            <CardDescription>
              Utilize o menu à esquerda para navegar entre as seções e gerenciar o conteúdo do seu site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Acesse a nova área de <Link to="/admin/appointments" className="font-semibold text-brand hover:underline">Agendamentos</Link> para gerenciar as visitas e sua agenda.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;