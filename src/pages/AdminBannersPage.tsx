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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const bannerSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, 'O título é obrigatório.'),
  subtitle: z.string().min(1, 'O subtítulo é obrigatório.'),
  imageUrl: z.string().url('Por favor, insira uma URL de imagem válida.'),
  buttonText: z.string().min(1, 'O texto do botão é obrigatório.'),
  buttonLink: z.string().min(1, 'O link do botão é obrigatório.'),
});

type Banner = z.infer<typeof bannerSchema>;

const initialBanners: Banner[] = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop",
    title: 'Elegância que <br /> <span class="text-brand">vem até você</span>',
    subtitle: 'Agende uma visita e vamos até você. É fácil: escolha nossos produtos e levamos até você, no conforto do seu lar ou onde estiver.',
    buttonText: 'Conhecer Coleção',
    buttonLink: '/products',
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=1974&auto=format&fit=crop",
    title: 'Nova Coleção <br /> <span class="text-brand">Outono/Inverno</span>',
    subtitle: 'Descubra as últimas tendências e peças exclusivas que acabaram de chegar.',
    buttonText: 'Ver Novidades',
    buttonLink: '/products',
  },
];

const AdminBannersPage = () => {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const form = useForm<Banner>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      imageUrl: '',
      buttonText: '',
      buttonLink: '',
    },
  });

  const handleAddNew = () => {
    setEditingBanner(null);
    form.reset({ title: '', subtitle: '', imageUrl: '', buttonText: '', buttonLink: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    form.reset(banner);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setBanners(banners.filter((b) => b.id !== id));
    toast.success('Banner removido com sucesso!');
  };

  const onSubmit = (values: Banner) => {
    if (editingBanner) {
      // Edit
      setBanners(banners.map((b) => (b.id === editingBanner.id ? { ...b, ...values } : b)));
      toast.success('Banner atualizado com sucesso!');
    } else {
      // Add
      const newBanner = { ...values, id: Date.now() };
      setBanners([...banners, newBanner]);
      toast.success('Banner adicionado com sucesso!');
    }
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-display">Gerenciar Banners</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} disabled={banners.length >= 4}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingBanner ? 'Editar Banner' : 'Adicionar Novo Banner'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem</FormLabel>
                    <FormControl><Input placeholder="https://exemplo.com/imagem.jpg" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl><Textarea placeholder="Título do banner (use <br /> para quebra de linha)" {...field} /></FormControl>
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
                <FormField control={form.control} name="buttonText" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto do Botão</FormLabel>
                    <FormControl><Input placeholder="Ex: Ver Coleção" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="buttonLink" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link do Botão</FormLabel>
                    <FormControl><Input placeholder="Ex: /products" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="flex justify-end pt-4">
                  <Button type="submit">Salvar</Button>
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
                <img src={banner.imageUrl} alt="Preview" className="w-full h-40 object-cover" />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg" dangerouslySetInnerHTML={{ __html: banner.title.replace(/<span class="text-brand">/g, '<span class="text-orange-500">') }} />
                <CardDescription className="mt-2 text-sm line-clamp-2">{banner.subtitle}</CardDescription>
              </CardContent>
              <CardFooter className="bg-muted/50 p-4 flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(banner)}>
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" /> Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Essa ação não pode ser desfeita. Isso excluirá permanentemente o banner.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(banner.id!)}>Continuar</AlertDialogAction>
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