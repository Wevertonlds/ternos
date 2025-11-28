import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { useBanners } from '@/hooks/useBanners';

const HeroCarousel = () => {
  const { data: banners = [], isLoading, error } = useBanners();

  const plugin = React.useRef(
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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <p>Nenhum banner disponível no momento.</p>
      </div>
    );
  }

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
                <Link to={banner.button_link} className="mt-8 inline-block" style={{ animationDelay: '0.4s' }}>
                  <Button size="lg" className="bg-brand hover:bg-brand/90 text-brand-foreground h-14 px-8 text-lg">
                    {banner.button_text}
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