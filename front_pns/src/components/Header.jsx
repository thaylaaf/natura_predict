import React from 'react';
import logo from '../assets/logo_predict.png'; 

const Header = () => {
  return (
  <header className="flex justify-between items-center p-13 bg-[#0F7A73] h-[90px]">
  <div className="flex items-center gap-5.5">
    <img
      src={logo}
      alt="Logo Computer Science"
      className="h-[60px] w-auto"
    />
    <span className="text-white text-lg font-light tracking-wide">
      NaturaPREDICT
    </span>
  </div>

  <nav className="flex gap-12">
    <a
      href="/"
      className="text-white no-underline text-base font-light tracking-wide transition hover:underline"
    >
      NAVEGAR POR ATIVOS
    </a>
    <a
      href="/sobre"
      className="text-white no-underline text-base font-light tracking-wide transition hover:underline"
    >
      SOBRE
    </a>
        <a
      href="/sobre"
      className="text-white no-underline text-base font-light tracking-wide transition hover:underline"
    >
      LOGIN
    </a>
  </nav>
</header>


  );
};

export default Header;