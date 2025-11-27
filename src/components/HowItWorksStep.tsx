import React from 'react';
import { Card } from '@/components/ui/card';

interface HowItWorksStepProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const HowItWorksStep: React.FC<HowItWorksStepProps> = ({ number, icon, title, description }) => {
  return (
    <div className="relative animate-fade-in">
      <div className="absolute -top-5 -left-5 w-10 h-10 bg-brand rounded-full flex items-center justify-center text-brand-foreground font-bold text-lg shadow-md">
        {number}
      </div>
      <Card className="text-center p-6 pt-12 h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-foreground rounded-full flex items-center justify-center">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-bold font-display mb-2">{title}</h3>
        <p className="text-muted-foreground px-2">{description}</p>
      </Card>
    </div>
  );
};

export default HowItWorksStep;