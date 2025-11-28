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
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { Loader2 } from 'lucide-react';
import { Settings } from '@/types';

const settingsSchema = z.object({
  site_name: z.string().min(3, 'O nome do site deve ter pelo menos 3 caracteres.'),
  brand_color: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, 'Por favor, insira uma cor hexadecimal válida (ex: #F59E0B).'),
  contact_email: z.string().email('Por favor, insira um email válido.'),
  contact_phone: z.string().min(10, 'Por favor, insira um telefone válido.'),
  footer_description: z.string().optional(),
  footer_quote: z.string().optional(),
});

const AdminSettingsPage = () => {
  const { data: settings, isLoading } = useSettings();
  const updateSettingsMutation = useUpdateSettings();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      site_name: '',
      brand_color: '',
      contact_email: '',
      contact_phone: '',
      footer_description: '',
      footer_quote: '',
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        site_name: settings.site_name || '',
        brand_color: settings.brand_color || '',
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        footer_description: settings.footer_description || '',
        footer_quote: settings.footer_quote || '',
      });
    }
  }, [settings, form]);

  const brandColor = form.watch('brand_color');

  useEffect(() => {
    if (brandColor) {
      document.documentElement.style.setProperty('--brand-preview', brandColor);
    }
  }, [brandColor]);

  const onSubmit = (values: z.infer<typeof settingsSchema>) => {
    updateSettingsMutation.mutate(values, {
      onSuccess: () => {
        toast.success('Configurações salvas com sucesso!');
      },
      onError: (error) => {
        toast.error(`Erro ao salvar: ${error.message}`);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-brand" />
      </div>
    );
  }

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
                name="site_name"
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
                name="brand_color"
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
                name="contact_email"
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
                name="contact_phone"
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
                name="footer_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do Rodapé</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Elegância que vem até você..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="footer_quote"
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

          <Button type="submit" disabled={updateSettingsMutation.isPending}>
            {updateSettingsMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminSettingsPage;