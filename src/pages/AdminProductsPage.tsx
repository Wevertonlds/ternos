import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminProductsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold font-display mb-6">Gerenciar Produtos</h1>
      <Card>
        <CardHeader>
          <CardTitle>Em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta área está em desenvolvimento. Aqui você poderá gerenciar o catálogo de produtos do site.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProductsPage;