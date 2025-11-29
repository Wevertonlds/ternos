import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/hooks/useSettings';

const Footer = () => {
  const { data: settings, isLoading, error } = useSettings();

  if (isLoading) {
    return (
      <footer className="bg-foreground text-background">
        <div className="container mx-auto py-20"></div>
      </footer>
    );
  }

  if (error || !settings) {
    console.error("Failed to load settings for footer:", error);
    return (
       <footer className="bg-foreground text-background">
        <div className="container mx-auto py-12 px-4 text-center">
          <p className="text-background/70">Não foi possível carregar as informações do site.</p>
          <p className="text-background/50 text-sm mt-2">
            Por favor, acesse a área de gestão para configurar o site.
          </p>
          <div className="mt-8 pt-8 border-t border-background/20">
            <Link to="/admin" className="text-sm text-brand hover:underline">Acessar Área de Gestão</Link>
          </div>
        </div>
      </footer>
    );
  }

  const siteNameFirstWord = settings?.site_name?.split(' ')[0] || '';
  const siteNameRest = settings?.site_name?.split(' ').slice(1).join(' ') || '';
  
  const footerQuote = settings.footer_quote?.trim();
  const footerSignature = settings.footer_signature?.trim();

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold font-display tracking-wider">
              <span className="text-brand">{siteNameFirstWord}</span> {siteNameRest}
            </h3>
            <p className="mt-4 text-background/70 max-w-sm">
              {settings.footer_description || 'Elegância que vem até você. Oferecemos uma curadoria de moda masculina com a conveniência de um atendimento personalizado em domicílio.'}
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
            {settings && (
              <ul className="space-y-2 text-background/70">
                <li>Email: {settings.contact_email}</li>
                <li>Telefone: {settings.contact_phone}</li>
                <li>São Paulo, SP</li>
              </ul>
            )}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-background/20 flex flex-col md:flex-row justify-between items-center md:items-end gap-4 text-sm text-background/50">
          <div className="text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} <span className="text-brand">{siteNameFirstWord}</span> {siteNameRest}. Todos os direitos reservados.</p>
            <Link to="/admin" className="text-xs hover:text-brand transition-colors mt-2 inline-block">Área de Gestão</Link>
          </div>
          {(footerQuote || footerSignature) && (
            <div className="text-center md:text-right">
              {footerQuote && (
                <p className="text-brand/75 text-xs italic">
                  "{footerQuote}"
                </p>
              )}
              {footerSignature && (
                <p className="text-brand/75 text-xs font-semibold mt-1">
                  {footerSignature}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;