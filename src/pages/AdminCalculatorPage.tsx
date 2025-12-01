import React, { useState, useMemo, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TrendingUp, TrendingDown, DollarSign, Percent, Tag } from 'lucide-react';

interface CalculationResult {
  cost: number;
  sellPrice: number;
  absoluteProfit: number;
  profitMargin: number;
  minPriceToProfit: number;
  idealPrice: number;
  maxDiscountValue: number;
  maxDiscountPercentage: number;
}

const formatCurrency = (value: number) => {
  if (isNaN(value)) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const AdminCalculatorPage = () => {
  const { data: products = [], isLoading } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>();
  const [costPrice, setCostPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === Number(selectedProductId));
  }, [selectedProductId, products]);

  useEffect(() => {
    if (selectedProduct) {
      setCostPrice(String(selectedProduct.price));
    }
  }, [selectedProduct]);

  const suggestions = useMemo(() => {
    const cost = parseFloat(costPrice);
    if (isNaN(cost) || cost <= 0) return null;
    return {
      min: cost * 1.2,
      ideal: cost * 2,
      premium: cost * 2.5,
    };
  }, [costPrice]);

  const handleCalculate = () => {
    const cost = parseFloat(costPrice);
    const sell = parseFloat(sellPrice);

    if (isNaN(cost) || isNaN(sell) || cost <= 0 || sell <= 0) {
      return;
    }

    const absoluteProfit = sell - cost;
    const profitMargin = (absoluteProfit / sell) * 100;
    const minPriceToProfit = cost * 1.1;
    const maxDiscountValue = sell - minPriceToProfit;

    setResult({
      cost,
      sellPrice: sell,
      absoluteProfit,
      profitMargin,
      minPriceToProfit,
      idealPrice: cost * 2,
      maxDiscountValue,
      maxDiscountPercentage: (maxDiscountValue / sell) * 100,
    });
  };

  const ResultCard = ({ icon: Icon, title, value, colorClass = 'text-foreground' }: { icon: React.ElementType, title: string, value: string, colorClass?: string }) => (
    <div className="flex items-start space-x-4 rounded-lg bg-muted/50 p-4">
      <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${colorClass.replace('text-', 'bg-')}/10`}>
        <Icon className={`h-5 w-5 ${colorClass}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold font-display mb-6">Calculadora de Preços</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Coluna de Inputs */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Produto</CardTitle>
              <CardDescription>Selecione um produto ou digite o custo manualmente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="product">Produto (Opcional)</Label>
                <Select onValueChange={setSelectedProductId} value={selectedProductId}>
                  <SelectTrigger id="product">
                    <SelectValue placeholder={isLoading ? 'Carregando...' : 'Selecione um produto'} />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product: Product) => (
                      <SelectItem key={product.id} value={String(product.id)}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cost">Preço de Custo</Label>
                <Input
                  id="cost"
                  type="number"
                  placeholder="Ex: 100.00"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="sell-price">Preço de Venda Desejado</Label>
                <Input
                  id="sell-price"
                  type="number"
                  placeholder="Ex: 199.90"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  disabled={!costPrice}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCalculate} disabled={!costPrice || !sellPrice} className="w-full">
                Calcular
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Coluna de Resultados e Sugestões */}
        <div className="lg:col-span-2 space-y-6">
          {suggestions && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Sugestões de Preço</CardTitle>
                <CardDescription>Com base no custo de {formatCurrency(parseFloat(costPrice))}, sugerimos os seguintes preços de venda:</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ResultCard icon={TrendingDown} title="Preço Mínimo" value={formatCurrency(suggestions.min)} colorClass="text-amber-600" />
                <ResultCard icon={TrendingUp} title="Preço Ideal" value={formatCurrency(suggestions.ideal)} colorClass="text-green-600" />
                <ResultCard icon={DollarSign} title="Preço Premium" value={formatCurrency(suggestions.premium)} colorClass="text-blue-600" />
              </CardContent>
            </Card>
          )}

          {result && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Análise de Preço</CardTitle>
                <CardDescription>Resultados com base no preço de venda de {formatCurrency(result.sellPrice)}.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ResultCard icon={DollarSign} title="Custo" value={formatCurrency(result.cost)} />
                <ResultCard icon={DollarSign} title="Venda" value={formatCurrency(result.sellPrice)} />
                <ResultCard icon={TrendingUp} title="Lucro Absoluto" value={formatCurrency(result.absoluteProfit)} colorClass="text-green-600" />
                <ResultCard icon={Percent} title="Margem de Lucro" value={`${result.profitMargin.toFixed(2)}%`} colorClass="text-green-600" />
                <ResultCard icon={TrendingDown} title="Preço Mínimo (Lucro 10%)" value={formatCurrency(result.minPriceToProfit)} colorClass="text-amber-600" />
                <ResultCard icon={TrendingUp} title="Sugestão Ideal (Lucro 100%)" value={formatCurrency(result.idealPrice)} colorClass="text-blue-600" />
                <ResultCard icon={Tag} title="Desconto Máximo" value={`${formatCurrency(result.maxDiscountValue)} (${result.maxDiscountPercentage.toFixed(2)}%)`} colorClass="text-destructive" />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCalculatorPage;