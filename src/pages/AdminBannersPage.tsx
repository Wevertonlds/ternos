import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminBannersPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold font-display mb-6">Gerenciar Banners</h1>
      <Card>
        <CardHeader>
          <CardTitle>Em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta área está em desenvolvimento. Aqui você poderá adicionar, editar e remover os banners da página inicial.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBannersPage;