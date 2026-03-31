import React from 'react';
import logo from '../assets/logo_predict.png'; 
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const isLogado = !!localStorage.getItem('token');

  const handleSair = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioNome'); 
    navigate('/'); 
    window.location.reload();
  };

  return (
    // Ajustado: p-4 em telas pequenas e p-13 em telas grandes. h-auto para não cortar conteúdo.
    <header className="flex justify-between items-center px-4 md:px-13 bg-[#0F7A73] h-[90px] w-full">
      
      {/* Logo e Texto: gap reduzido no mobile */}
      <Link to="/" className="flex items-center gap-2 md:gap-5.5 hover:opacity-90 transition-opacity shrink-0">
        <img
          src={logo}
          alt="Logo NaturaPREDICT"
          // Ajustado: h-[40px] no mobile e h-[60px] no desktop
          className="h-[40px] md:h-[60px] w-auto"
        />
        <span className="text-white text-sm md:text-lg font-light tracking-wide">
          NaturaPREDICT
        </span>
      </Link>

      {/* Nav: gap reduzido drasticamente no mobile */}
      <nav className="flex gap-3 md:gap-12 items-center">
        <Link
          to="/navegacao"
          // Ajustado: texto menor no mobile (text-xs)
          className="text-white no-underline text-[12px] sm:text-xs md:text-base font-light tracking-wide transition hover:underline whitespace-nowrap"
        >
          NAVEGAR
        </Link>

        {isLogado ? (
          <div className="flex gap-3 md:gap-6 items-center">
            <Link to="/PainelControle" className="text-white font-bold hover:underline text-xs md:text-base">
              PAINEL
            </Link>
            
            <button 
              onClick={handleSair}
              className="text-white bg-teal-800 px-2 py-1 md:px-4 md:py-1.5 rounded-lg hover:bg-teal-900 transition font-medium text-[10px] md:text-sm"
            >
              SAIR
            </button>
          </div>
        ) : (
          <Link to="/login" className="text-white hover:underline text-xs md:text-base">
            LOGIN
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;