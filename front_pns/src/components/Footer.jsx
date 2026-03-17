import React from 'react';
import LAAB_LOGO from '../assets/LAAB_CASE.png';
import ufs_logo from '../assets/logo_ufs.png';

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-t from-[#0F7A73] to-white p-15 text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
     
        <div className="flex flex-col md:flex-row items-center gap-9">
       
          <img 
            src={LAAB_LOGO}
            alt="LAAB Logo" 
            className="h-20" // tamanho da logo
          />
          
          <img 
            src={ufs_logo}
            alt="UFS Logo" 
            className="h-20"
          />
        </div>

        <div className="text-left space-y-1 font-light">
          <p className="text-base">
            Universidade Federal de Sergipe
          </p>
          <p className="text-base">
            Contato xxxxxxxxxxxxxxx
          </p>
          <p className="text-base ">
            São Cristóvão, Sergipe, Brasil
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;