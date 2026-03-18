import React from 'react';
import logo from '../assets/logo_predict.png'; 
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  
  // Verifica se o usuário está logado (se existe token)
  const isLogado = !!localStorage.getItem('token');

  const handleSair = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioNome'); 
    navigate('/'); 
    window.location.reload(); // Recarrega para atualizar o estado do Header
  };

  return (
    <header className="flex justify-between items-center p-13 bg-[#0F7A73] h-[90px]">
      <Link to="/" className="flex items-center gap-5.5 hover:opacity-90 transition-opacity">
        <img
          src={logo}
          alt="Logo NaturaPREDICT"
          className="h-[60px] w-auto"
        />
        <span className="text-white text-lg font-light tracking-wide">
          NaturaPREDICT
        </span>
      </Link>

      <nav className="flex gap-12 items-center">
        <Link
          to="/"
          className="text-white no-underline text-base font-light tracking-wide transition hover:underline"
        >
          NAVEGAR POR ATIVOS
        </Link>
        <Link
          to="/sobre"
          className="text-white no-underline text-base font-light tracking-wide transition hover:underline"
        >
          SOBRE
        </Link>

        {/* LÓGICA DE MUDANÇA DO BOTÃO */}
        {isLogado ? (
          <div className="flex gap-6 items-center">
            {/* Mantemos o link para o Painel para facilitar a navegação */}
            <Link to="/PainelControle" className="text-white font-bold hover:underline">
              PAINEL
            </Link>
            
            {/* BOTÃO SAIR AJUSTADO COM A COR PREDOMINANTE */}
            <button 
              onClick={handleSair}
              // Usei bg-teal-800 e hover:bg-teal-900 para destacar do fundo teal-700
              className="text-white bg-teal-800 px-4 py-1.5 rounded-lg hover:bg-teal-900 transition font-medium text-sm"
            >
              SAIR
            </button>
          </div>
        ) : (
          <Link to="/login" className="text-white hover:underline">
            LOGIN
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;