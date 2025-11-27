import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Settings, Image, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
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
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 no último mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Cadastrados</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Total de itens no catálogo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banners Ativos</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Banners no carrossel</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configurações</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link to="/admin/settings" className="text-sm text-brand hover:underline">
              Gerenciar o site
            </Link>
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
            <p>Comece pelas <Link to="/admin/settings" className="font-semibold text-brand hover:underline">Configurações</Link> para ajustar a aparência e informações de contato, ou vá para <Link to="/admin/banners" className="font-semibold text-brand hover:underline">Banners</Link> e <Link to="/admin/products" className="font-semibold text-brand hover:underline">Produtos</Link> para atualizar o conteúdo.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;