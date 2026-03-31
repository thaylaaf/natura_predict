import React from 'react';
import LAAB_LOGO from '../assets/LAAB_CASE.png';
import ufs_logo from '../assets/logo_ufs.png';

const Footer = () => {
  return (
    // Ajustado: p-6 no mobile para evitar o estouro de tela, p-15 no desktop
    <footer className="w-full bg-gradient-to-t from-[#0F7A73] to-white p-6 md:p-15 text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Logos: Mantidas lado a lado com flex-row e gap menor */}
        <div className="flex flex-row items-center gap-4 md:gap-9">
          <img 
            src={LAAB_LOGO}
            alt="LAAB Logo" 
            // Ajustado: h-12 no mobile (48px) e h-20 no desktop (80px)
            className="h-12 md:h-20 w-auto object-contain"
          />
          
          <img 
            src={ufs_logo}
            alt="UFS Logo" 
            className="h-12 md:h-20 w-auto object-contain"
          />
        </div>

        {/* Texto: Centralizado no mobile (text-center) e esquerda no desktop (md:text-left) */}
        <div className="text-center md:text-left space-y-1 font-light">
          <p className="text-xs md:text-base">
            Universidade Federal de Sergipe
          </p>
          <p className="text-xs md:text-base">
            LAAB - Laboratório de Alimentos e Bebidas
          </p>
          <p className="text-xs md:text-base">
            São Cristóvão, Sergipe, Brasil
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;