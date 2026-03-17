// src/components/SearchBar.jsx
import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  // Simplificamos o placeholder para refletir a busca inteligente
  const placeholderText = "Pesquise por nome, fórmula, SMILES ou uso medicinal...";

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex items-center w-full p-2 bg-slate-100 rounded-full shadow-lg border-2 border-slate-300 focus-within:border-[#0F7A73] transition-colors">
      <div className="flex-none p-2 text-gray-500">
        <FaSearch />
      </div>
      <input
        type="text"
        placeholder={placeholderText}
        value={searchTerm}
        onChange={handleChange}
        className="flex-grow p-2 text-gray-700 bg-transparent outline-none"
      />
    </div>
  );
};

export default SearchBar;