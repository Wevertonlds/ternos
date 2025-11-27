import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";

const banners = [
  {
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop",
    title: 'Elegância que <br /> <span class="text-brand">vem até você</span>',
    subtitle: 'Agende uma visita e vamos até você. É fácil: escolha nossos produtos e levamos até você, no conforto do seu lar ou onde estiver.',
    buttonText: 'Conhecer Coleção',
    buttonLink: '/products',
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=1974&auto=format&fit=crop",
    title: 'Nova Coleção <br /> <span class="text-brand">Outono/Inverno</span>',
    subtitle: 'Descubra as últimas tendências e peças exclusivas que acabaram de chegar.',
    buttonText: 'Ver Novidades',
    buttonLink: '/products',
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?q=80&w=1974&auto=format&fit=crop",
    title: 'A Loja Que <br /> <span class="text-brand">Vai Até Você</span>',
    subtitle: 'Navegue, escolha suas peças favoritas e agende. Nós levamos tudo até você para provar no conforto da sua casa.',
    buttonText: 'Entenda Como Funciona',
    buttonLink: '/how-it-works',
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2070&auto=format&fit=crop",
    title: 'Estilo e <br /> <span class="text-brand">Conveniência</span>',
    subtitle: 'Nossos especialistas em moda vão até você para uma consultoria de estilo personalizada.',
    buttonText: 'Como Funciona',
    buttonLink: '/how-it-works',
  },
];

const HeroCarousel = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 19000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {banners.map((banner, index) => (
          <CarouselItem key={index}>
            <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40"
                style={{ backgroundImage: `url('${banner.imageUrl}')` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
              <div className="relative z-10 text-center px-4 animate-fade-in">
                <h1
                  className="text-6xl md:text-8xl font-bold font-display"
                  dangerouslySetInnerHTML={{ __html: banner.title }}
                />
                <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
                  {banner.subtitle}
                </p>
                <Link to={banner.buttonLink} className="mt-8 inline-block" style={{ animationDelay: '0.4s' }}>
                  <Button size="lg" className="bg-brand hover:bg-brand/90 text-brand-foreground h-14 px-8 text-lg">
                    {banner.buttonText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 z-20 text-white bg-black/20 hover:bg-black/50 border-none" />
      <CarouselNext className="absolute right-4 z-20 text-white bg-black/20 hover:bg-black/50 border-none" />
    </Carousel>
  );
};

export default HeroCarousel;