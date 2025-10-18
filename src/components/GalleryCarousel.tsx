import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { GalleryAlbum } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, EyeIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface GalleryCarouselProps {
  albums: GalleryAlbum[];
  onAlbumClick: (album: GalleryAlbum) => void;
}

const GalleryCarousel: React.FC<GalleryCarouselProps> = ({ albums, onAlbumClick }) => {
  const swiperRef = useRef<any>(null);

  if (!albums || albums.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-6 bg-pm-gold/10 rounded-full flex items-center justify-center">
          <EyeIcon className="w-12 h-12 text-pm-gold/50" />
        </div>
        <h3 className="text-xl font-playfair text-pm-gold mb-2">Aucun album disponible</h3>
        <p className="text-pm-off-white/60">Les albums photos seront bientôt disponibles.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={30}
        slidesPerView={1}
        navigation={{
          nextEl: '.gallery-swiper-button-next',
          prevEl: '.gallery-swiper-button-prev',
        }}
        pagination={{
          clickable: true,
          bulletClass: 'gallery-swiper-bullet',
          bulletActiveClass: 'gallery-swiper-bullet-active',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        loop={albums.length > 1}
        className="gallery-swiper"
      >
        {albums.map((album) => (
          <SwiperSlide key={album.id}>
            <div className="relative group cursor-pointer" onClick={() => onAlbumClick(album)}>
              {/* Album Cover */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-black border border-pm-gold/20 group-hover:border-pm-gold transition-all duration-500">
                {album.coverUrl ? (
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : album.images && album.images.length > 0 ? (
                  <img
                    src={album.images[0]}
                    alt={album.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pm-gold/20 to-pm-gold/5 flex items-center justify-center">
                    <EyeIcon className="w-16 h-16 text-pm-gold/50" />
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    {album.category && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-pm-gold/20 text-pm-gold text-xs font-bold uppercase tracking-wider rounded-full">
                        <TagIcon className="w-3 h-3" />
                        {album.category}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-black/40 text-pm-off-white text-xs font-medium rounded-full">
                      <CalendarIcon className="w-3 h-3" />
                      {new Date(album.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-playfair font-bold mb-2 group-hover:text-pm-gold transition-colors duration-300">
                    {album.title}
                  </h3>
                  
                  {album.description && (
                    <p className="text-pm-off-white/90 text-sm lg:text-base mb-4 line-clamp-2">
                      {album.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-pm-off-white/70 text-sm">
                      <EyeIcon className="w-4 h-4" />
                      <span>{album.images?.length || 0} photos</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-pm-gold font-bold text-sm uppercase tracking-wider">
                      Voir l'album
                      <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      {albums.length > 1 && (
        <>
          <button
            className="gallery-swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/60 hover:bg-black/80 text-pm-gold rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-pm-gold/20"
            aria-label="Album précédent"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          
          <button
            className="gallery-swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/60 hover:bg-black/80 text-pm-gold rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-pm-gold/20"
            aria-label="Album suivant"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
};

export default GalleryCarousel;