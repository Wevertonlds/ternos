import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { Banner } from '@/types';
import { useBanners, useAddBanner, useUpdateBanner, useDeleteBanner } from '@/hooks/useBanners';

const bannerSchema = z.object({
  id: z.number().optional(),
  title_line_1: z.string().min(1, 'A primeira linha do título é obrigatória.'),
  title_line_2: z.string().optional(),
  subtitle: z.string().min(1, 'O subtítulo é obrigatório.'),
  image_url: z.string().optional(),
  imageFile: z.any().optional(),
  button_text: z.string().min(1, 'O texto do botão é obrigatório.'),
  button_link: z.string().min(1, 'O link do botão é obrigatório.'),
}).refine(data => {
  return data.id || (data.imageFile && data.imageFile.length > 0);
}, {
  message: 'A imagem do banner é obrigatória.',
  path: ['imageFile'],
});

type BannerFormData = z.infer<typeof bannerSchema>;

const AdminBannersPage = () => {
  const { data: banners = [], isLoading, error } = useBanners();
  const addBannerMutation = useAddBanner();
  const updateBannerMutation = useUpdateBanner();
  const deleteBannerMutation = useDeleteBanner();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title_line_1: '',
      title_line_2: '',
      subtitle: '',
      image_url: '',
      button_text: '',
      button_link: '',
      imageFile: undefined,
    },
  });

  const handleAddNew = () => {
    setEditingBanner(null);
    setImagePreview(null);
    form.reset({ 
      title_line_1: '',
      title_line_2: '',
      subtitle: '', 
      image_url: '',
      imageFile: undefined, 
      button_text: '', 
      button_link: '' 
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setImagePreview(banner.image_url);
    const [line1 = '', line2 = ''] = banner.title.split('<br />');
    form.reset({
      id: banner.id,
      title_line_1: line1,
      title_line_2: line2,
      subtitle: banner.subtitle || '',
      image_url: banner.image_url,
      button_text: banner.button_text || '',
      button_link: banner.button_link || '',
      imageFile: undefined,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingBanner) return;
    deleteBannerMutation.mutate(deletingBanner, {
      onSuccess: () => {
        toast.success('Banner removido com sucesso!');
        setDeletingBanner(null);
      },
      onError: (err: any) => {
        toast.error(`Erro ao remover banner: ${err.message}`);
        setDeletingBanner(null);
      },
    });
  };

  const onSubmit = (values: BannerFormData) => {
    const imageFile = values.imageFile?.[0];
    const mutationOptions = {
      onSuccess: () => {
        toast.success(`Banner ${editingBanner ? 'atualizado' : 'adicionado'} com sucesso!`);
        setIsDialogOpen(false);
      },
      onError: (err: any) => {
        toast.error(`Erro ao salvar banner: ${err.message}`);
      },
    };

    const finalTitle = values.title_line_2 
      ? `${values.title_line_1}<br />${values.title_line_2}` 
      : values.title_line_1;

    if (editingBanner) {
      const bannerToUpdate: Omit<Banner, 'created_at'> = {
        id: editingBanner.id,
        title: finalTitle,
        subtitle: values.subtitle,
        button_text: values.button_text,
        button_link: values.button_link,
        image_url: editingBanner.image_url,
      };
      updateBannerMutation.mutate({ banner: bannerToUpdate, imageFile }, mutationOptions);
    } else {
      const bannerToAdd: Omit<Banner, 'id' | 'created_at' | 'image_url'> = {
        title: finalTitle,
        subtitle: values.subtitle,
        button_text: values.button_text,
        button_link: values.button_link,
      };
      addBannerMutation.mutate({ banner: bannerToAdd, imageFile }, mutationOptions);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-brand" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Erro ao carregar banners: {error.message}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-display">Gerenciar Banners</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBanner ? 'Editar Banner' : 'Adicionar Novo Banner'}</DialogTitle>
              <DialogDescription>
                Preencha as informações abaixo para criar ou atualizar um banner.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="imageFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagem do Banner</FormLabel>
                      {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-md my-2" />}
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(e.target.files);
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setImagePreview(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="title_line_1" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título (Linha 1)</FormLabel>
                    <FormControl><Input placeholder="Primeira linha do título" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="title_line_2" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título (Linha 2 - Opcional)</FormLabel>
                    <FormControl><Input placeholder="Segunda linha do título" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="subtitle" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtítulo</FormLabel>
                    <FormControl><Textarea placeholder="Subtítulo do banner" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="button_text" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto do Botão</FormLabel>
                    <FormControl><Input placeholder="Ex: Ver Coleção" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="button_link" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link do Botão</FormLabel>
                    <FormControl><Input placeholder="Ex: /products" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={addBannerMutation.isPending || updateBannerMutation.isPending}>
                    {(addBannerMutation.isPending || updateBannerMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {banners.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Nenhum banner cadastrado. Adicione o primeiro!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {banners.map((banner) => (
            <Card key={banner.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <img src={banner.image_url} alt="Preview" className="w-full h-40 object-cover" />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg" dangerouslySetInnerHTML={{ __html: banner.title.replace(/<span class="text-brand">/g, '<span class="text-orange-500">') }} />
                <CardDescription className="mt-2 text-sm line-clamp-2">{banner.subtitle}</CardDescription>
              </CardContent>
              <CardFooter className="bg-muted/50 p-4 flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(banner)}>
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </Button>
                <AlertDialog open={deletingBanner === banner} onOpenChange={(open) => !open && setDeletingBanner(null)}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" onClick={() => setDeletingBanner(banner)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Essa ação não pode ser desfeita. Isso excluirá permanentemente o banner e sua imagem.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setDeletingBanner(null)}>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteConfirm} disabled={deleteBannerMutation.isPending}>
                        {deleteBannerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Continuar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBannersPage;