import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // 1. Importação necessária
import SearchBar from '../components/SearchBar'; 

const SearchContainer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/public/substances/suggestions`, {
        params: { termo: searchTerm }
      });
      
      setResults(response.data);
    } catch (error) {
      console.error("Erro ao buscar no banco de dados:", error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      
      <div className="flex flex-col items-center gap-4 w-full max-w-xl">
        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          placeholder="Pesquise por nome, fórmula, SMILES ou uso..."
        />
      </div>

      <button 
        onClick={handleSearch}
        disabled={loading}
        className="px-10 py-2 bg-[#0F7A73] text-white rounded-lg shadow-md transition hover:bg-[#0A5A53] disabled:bg-gray-400"
      >
        {loading ? 'Buscando...' : 'Pesquisar'}
      </button>

      {/* Listagem de Resultados */}
      <div className="w-full max-w-xl mt-4">
        {results.length > 0 && (
          <div className="flex flex-col gap-2">
            {results.map((item) => (
              /* 2. Envolvendo o item com o Link para a rota de detalhes */
              <Link 
                to={`/substance/${item.id}`} 
                key={item.id} 
                className="no-underline block"
              >
                <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-[#0F7A73] hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-[#0F7A73] text-lg group-hover:underline">
                        {item.nome}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({item.origem})
                      </span>
                    </div>
                    <span className="text-gray-400 text-xs">Ver detalhes →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default SearchContainer;