import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { useBanners } from '@/hooks/useBanners';

const HeroCarousel = () => {
  const { data: banners = [], isLoading, error } = useBanners();

  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 7000, stopOnInteraction: true })
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <Loader2 className="h-16 w-16 animate-spin text-brand" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <p className="text-red-500">Erro ao carregar banners: {error.message}</p>
      </div>
    );
  }

  if (banners.length === 0) {
    // Fallback content if no banners are configured
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <h1 className="text-4xl md:text-6xl font-bold font-display mb-4 text-brand">Bem-vindo!</h1>
        <p className="text-lg text-white/80 mb-8 text-center">
          Configure seus banners na área de gestão para começar.
        </p>
        <Link to="/admin/banners">
          <Button size="lg" className="bg-brand hover:bg-brand/90 text-brand-foreground h-14 px-8 text-lg">
            Ir para Banners Admin
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Carousel
      plugins={[autoplayPlugin.current]}
      className="w-full min-h-screen"
    >
      <CarouselContent>
        {banners.map((banner, index) => {
          return (
            <CarouselItem key={index}>
              <div className="relative flex flex-col justify-center min-h-screen bg-black text-white overflow-hidden">
                <div
                  className="absolute inset-0 bg-no-repeat opacity-50"
                  style={{ 
                    backgroundImage: `url('${banner.image_url}')`,
                    backgroundSize: banner.image_fit || 'cover',
                    backgroundPosition: banner.image_position || 'center',
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
                
                <div className="relative z-10 container mx-auto px-4 animate-fade-in">
                  <div className="max-w-3xl text-center md:text-left">
                    <h1
                      className="text-4xl sm:text-6xl md:text-7xl font-bold font-display leading-tight"
                      dangerouslySetInnerHTML={{ __html: banner.title }}
                    />
                    <p className="mt-6 text-lg md:text-xl text-white/80" style={{ animationDelay: '0.2s' }}>
                      {banner.subtitle}
                    </p>
                    <Link to={banner.button_link} className="mt-8 inline-block" style={{ animationDelay: '0.4s' }}>
                      <Button size="lg" className="bg-brand hover:bg-brand/90 text-brand-foreground h-14 px-8 text-lg">
                        {banner.button_text}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 z-20 text-white bg-black/20 hover:bg-black/50 border-none" />
      <CarouselNext className="absolute right-4 z-20 text-white bg-black/20 hover:bg-black/50 border-none" />
    </Carousel>
  );
};

export default HeroCarousel;