import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { products as initialProducts, Product } from '@/data/products';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';

const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'O nome é obrigatório.'),
  brand: z.string().min(1, 'A marca é obrigatória.'),
  price: z.coerce.number().min(0, 'O preço deve ser um número positivo.'),
  imageUrl: z.string().url('Por favor, insira uma URL de imagem válida.'),
  category: z.enum(['Terno', 'Camisa', 'Gravata', 'Sapato', 'Cinto', 'Meia']),
  sizes: z.string().min(1, 'Informe ao menos um tamanho.'),
});

type ProductFormData = z.infer<typeof productSchema>;

const categories: Product['category'][] = ['Terno', 'Camisa', 'Gravata', 'Sapato', 'Cinto', 'Meia'];
const mainCategories = ['Terno', 'Camisa', 'Gravata'];
const otherCategories = ['Sapato', 'Cinto', 'Meia'];

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const handleAddNew = () => {
    setEditingProduct(null);
    form.reset({
      name: '',
      brand: '',
      price: 0,
      imageUrl: '',
      category: 'Terno',
      sizes: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      ...product,
      sizes: product.sizes.join(', '),
    });
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingProductId === null) return;
    setProducts(products.filter((p) => p.id !== deletingProductId));
    toast.success('Produto removido com sucesso!');
    setDeletingProductId(null);
  };

  const onSubmit = (values: ProductFormData) => {
    const productData: Product = {
      ...values,
      id: editingProduct ? editingProduct.id : Date.now(),
      sizes: values.sizes.split(',').map(s => s.trim()),
    };

    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? productData : p)));
      toast.success('Produto atualizado com sucesso!');
    } else {
      setProducts([...products, productData]);
      toast.success('Produto adicionado com sucesso!');
    }
    setIsDialogOpen(false);
  };

  const renderProductTable = (categoryList: Product['category'][]) => {
    const filteredProducts = products.filter(p => categoryList.includes(p.category));

    return (
      <Card>
        <CardContent className="p-0">
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
                      <img alt={product.name} className="aspect-square rounded-md object-cover" height="64" src={product.imageUrl} width="64" />
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
                          <DropdownMenuItem onClick={() => setDeletingProductId(product.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
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
        </CardContent>
      </Card>
    );
  };

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

      {/* Product Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
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
              <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem><FormLabel>URL da Imagem</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
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
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deletingProductId !== null} onOpenChange={() => setDeletingProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente o produto.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingProductId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProductsPage;