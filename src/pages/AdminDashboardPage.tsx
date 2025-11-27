import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold font-display mb-6">Painel de Gestão</h1>
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo, Administrador!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Aqui você poderá gerenciar os agendamentos e outras informações do site.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;