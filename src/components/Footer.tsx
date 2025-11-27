import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold font-display tracking-wider">
              <span className="text-brand">PREMIUM</span> MEN
            </h3>
            <p className="mt-4 text-background/70 max-w-sm">
              Elegância que vem até você. Oferecemos uma curadoria de moda masculina com a conveniência de um atendimento personalizado em domicílio.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-background/70 hover:text-brand transition-colors">Início</Link></li>
              <li><Link to="/products" className="text-background/70 hover:text-brand transition-colors">Produtos</Link></li>
              <li><Link to="/how-it-works" className="text-background/70 hover:text-brand transition-colors">Como Funciona</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Contato</h4>
            <ul className="space-y-2 text-background/70">
              <li>Email: contato@premiummen.com</li>
              <li>Telefone: (11) 99999-8888</li>
              <li>São Paulo, SP</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-background/20 text-center text-sm text-background/50">
          <p>&copy; {new Date().getFullYear()} PREMIUM MEN. Todos os direitos reservados.</p>
          <Link to="#" className="text-xs hover:text-brand transition-colors mt-2 inline-block">Área de Gestão</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;