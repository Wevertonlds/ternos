import React from 'react';
import HowItWorksStep from '@/components/HowItWorksStep';
import { Search, CheckCircle2, CalendarDays, Home } from 'lucide-react';

const HowItWorksPage = () => {
  const steps = [
    {
      number: '1',
      icon: <Search className="h-10 w-10 text-brand" />,
      title: 'Navegue pelo Catálogo',
      description: 'Explore nossa coleção premium de moda masculina',
    },
    {
      number: '2',
      icon: <CheckCircle2 className="h-10 w-10 text-brand" />,
      title: 'Escolha as Peças',
      description: 'Selecione tamanhos, cores e adicione à Lista de Prova',
    },
    {
      number: '3',
      icon: <CalendarDays className="h-10 w-10 text-brand" />,
      title: 'Agende o Atendimento',
      description: 'Escolha data, horário e endereço para o atendimento',
    },
    {
      number: '4',
      icon: <Home className="h-10 w-10 text-brand" />,
      title: 'Receba em Casa',
      description: 'Nosso estilista leva as peças até você para provar',
    },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="container mx-auto py-24 pt-32 text-center">
        <h1 className="text-5xl font-bold font-display animate-fade-in">Como Funciona</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Um processo simples para uma experiência extraordinária
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mt-16">
          {steps.map((step, index) => (
            <div key={step.number} style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
              <HowItWorksStep
                number={step.number}
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;