import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === 'admin@admin' && password === 'admin123') {
      toast.success('Login bem-sucedido!');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    } else {
      toast.error('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md shadow-lg animate-scale-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold font-display">
              <span className="text-brand">La</span> hermandad | Gestão
            </CardTitle>
            <CardDescription>Acesse para gerenciar os agendamentos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@admin"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="admin123"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button onClick={handleLogin} className="w-full bg-brand hover:bg-brand/90 text-brand-foreground">
              Entrar
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default AdminLoginPage;