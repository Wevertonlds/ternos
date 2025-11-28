import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Product } from '@/types';
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { PlusCircle, MoreHorizontal, Edit, Trash2, Loader2 } from 'lucide-react';

const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'O nome é obrigatório.'),
  brand: z.string().min(1, 'A marca é obrigatória.'),
  price: z.coerce.number().min(0, 'O preço deve ser um número positivo.'),
  image_url: z.string().optional(),
  imageFile: z.any().optional(),
  category: z.enum(['Terno', 'Camisa', 'Gravata', 'Sapato', 'Cinto', 'Meia']),
  sizes: z.string().min(1, 'Informe ao menos um tamanho.'),
}).refine(data => {
  // If creating a new product (no id), an image file must be provided.
  return data.id || (data.imageFile && data.imageFile.length > 0);
}, {
  message: 'A imagem do produto é obrigatória.',
  path: ['imageFile'],
});

type ProductFormData = z.infer<typeof productSchema>;

const categories: Product['category'][] = ['Terno', 'Camisa', 'Gravata', 'Sapato', 'Cinto', 'Meia'];
const mainCategories: Product['category'][] = ['Terno', 'Camisa', 'Gravata'];
const otherCategories: Product['category'][] = ['Sapato', 'Cinto', 'Meia'];

const AdminProductsPage = () => {
  const { data: products = [], isLoading, error } = useProducts();
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      brand: '',
      price: 0,
      category: 'Terno',
      sizes: '',
    },
  });

  const handleAddNew = () => {
    setEditingProduct(null);
    setImagePreview(null);
    form.reset({
      name: '',
      brand: '',
      price: 0,
      image_url: '',
      imageFile: undefined,
      category: 'Terno',
      sizes: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setImagePreview(product.image_url);
    form.reset({
      id: product.id,
      name: product.name || '',
      brand: product.brand || '',
      price: product.price,
      image_url: product.image_url,
      category: product.category,
      sizes: product.sizes.join(', '),
      imageFile: undefined,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingProduct) return;
    deleteProductMutation.mutate(deletingProduct, {
      onSuccess: () => {
        toast.success('Produto removido com sucesso!');
        setDeletingProduct(null);
      },
      onError: (err: any) => {
        toast.error(`Erro ao remover produto: ${err.message}`);
        setDeletingProduct(null);
      },
    });
  };

  const onSubmit = (values: ProductFormData) => {
    const imageFile = values.imageFile?.[0];

    const mutationOptions = {
      onSuccess: () => {
        toast.success(`Produto ${editingProduct ? 'atualizado' : 'adicionado'} com sucesso!`);
        setIsDialogOpen(false);
      },
      onError: (err: any) => {
        toast.error(`Erro ao salvar produto: ${err.message}`);
      },
    };

    if (editingProduct) {
      const { imageFile: _i, image_url: _u, ...productData } = values;
      const updatedProduct = {
        ...productData,
        id: editingProduct.id,
        image_url: editingProduct.image_url,
        sizes: values.sizes.split(',').map(s => s.trim()),
      };
      updateProductMutation.mutate({ product: updatedProduct, imageFile }, mutationOptions);
    } else {
      const { id, image_url, imageFile: _i, ...newProductData } = values;
      const newProduct = {
        ...newProductData,
        sizes: values.sizes.split(',').map(s => s.trim()),
      };
      addProductMutation.mutate({ product: newProduct as any, imageFile }, mutationOptions);
    }
  };

  const renderProductTable = (categoryList: Product['category'][]) => {
    const filteredProducts = products.filter(p => categoryList.includes(p.category));

    return (
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">Imagem</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead><span className="sr-only">Ações</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="hidden sm:table-cell">
                        <img alt={product.name} className="aspect-square rounded-md object-cover" height="64" src={product.image_url} width="64" />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(product)}>
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDeletingProduct(product)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                              <Trash2 className="mr-2 h-4 w-4" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Nenhum produto encontrado nesta categoria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-brand" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Erro ao carregar produtos: {error.message}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-display">Gerenciar Produtos</h1>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Produto
        </Button>
      </div>

      <Tabs defaultValue="Terno">
        <TabsList>
          {mainCategories.map(cat => <TabsTrigger key={cat} value={cat}>{cat}s</TabsTrigger>)}
          <TabsTrigger value="Acessórios">Acessórios</TabsTrigger>
        </TabsList>
        {mainCategories.map(cat => (
          <TabsContent key={cat} value={cat}>
            {renderProductTable([cat])}
          </TabsContent>
        ))}
        <TabsContent value="Acessórios">
          {renderProductTable(otherCategories)}
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
            <DialogDescription>
              Preencha as informações do produto para adicioná-lo ou atualizá-lo no catálogo.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="brand" render={({ field }) => (
                <FormItem><FormLabel>Marca</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem><FormLabel>Preço</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField
                control={form.control}
                name="imageFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagem do Produto</FormLabel>
                    {imagePreview && <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-md my-2" />}
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
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="sizes" render={({ field }) => (
                <FormItem><FormLabel>Tamanhos (separados por vírgula)</FormLabel><FormControl><Input placeholder="P, M, G, 40, 42" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={addProductMutation.isPending || updateProductMutation.isPending}>
                  {(addProductMutation.isPending || updateProductMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deletingProduct !== null} onOpenChange={() => setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente o produto e sua imagem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingProduct(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={deleteProductMutation.isPending}>
              {deleteProductMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProductsPage;