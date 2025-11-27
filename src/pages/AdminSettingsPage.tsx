import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const settingsSchema = z.object({
  siteName: z.string().min(3, 'O nome do site deve ter pelo menos 3 caracteres.'),
  brandColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, 'Por favor, insira uma cor hexadecimal válida (ex: #F59E0B).'),
  contactEmail: z.string().email('Por favor, insira um email válido.'),
  contactPhone: z.string().min(10, 'Por favor, insira um telefone válido.'),
  footerQuote: z.string().optional(),
});

const AdminSettingsPage = () => {
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: 'La hermandad',
      brandColor: '#D97706',
      contactEmail: 'contato@lahermandad.com',
      contactPhone: '(11) 99999-8888',
      footerQuote: 'Gratidão não se paga com dinheiro, sim com atitudes! estamos juntos até depois do fim!',
    },
  });

  const brandColor = form.watch('brandColor');

  useEffect(() => {
    if (brandColor) {
      document.documentElement.style.setProperty('--brand-preview', brandColor);
    }
  }, [brandColor]);

  const onSubmit = (values: z.infer<typeof settingsSchema>) => {
    console.log('Salvando configurações:', values);
    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold font-display mb-6">Configurações do Site</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Identidade Visual</CardTitle>
              <CardDescription>Altere o nome e a cor principal do seu site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Site</FormLabel>
                    <FormControl>
                      <Input placeholder="La hermandad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brandColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor Principal (Hex)</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input placeholder="#D97706" {...field} />
                      </FormControl>
                      <div className="w-10 h-10 rounded-md border" style={{ backgroundColor: `var(--brand-preview, ${field.value})` }}></div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Rodapé</CardTitle>
              <CardDescription>Edite os dados de contato e a citação exibidos no rodapé.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email de Contato</FormLabel>
                    <FormControl>
                      <Input placeholder="contato@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone de Contato</FormLabel>
                    <FormControl>
                      <Input placeholder="(XX) XXXXX-XXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="footerQuote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Citação do Rodapé</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Sua citação aqui..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit">Salvar Alterações</Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminSettingsPage;