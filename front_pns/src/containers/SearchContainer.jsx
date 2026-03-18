import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar'; 

const SearchContainer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false); 
  const [searchPerformed, setSearchPerformed] = useState(false); 

  // ✨ NOVIDADE: Função que limpa os avisos ao digitar
  const handleInputChange = (newValue) => {
    setSearchTerm(newValue);
    
    // Se o usuário está digitando, a busca anterior "expirou"
    setSearchPerformed(false); 
    setError(false);

    // Opcional: Limpa os resultados se o campo ficar vazio
    if (newValue.trim() === '') {
      setResults([]);
    }
  };

  const handleSearch = async () => {
    const termToSearch = searchTerm.trim();
    if (!termToSearch) return;

    setLoading(true);
    setError(false);
    setSearchPerformed(false); 

    try {
      const response = await axios.get(`http://localhost:3000/public/substances/suggestions`, {
        params: { termo: termToSearch }
      });
      
      setResults(response.data);
      setSearchPerformed(true); 
    } catch (error) {
      console.error("Erro ao buscar no banco de dados:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      
      <div className="flex flex-col items-center gap-4 w-full max-w-xl">
        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={handleInputChange} // <-- Usando a função de controle aqui
          placeholder="Pesquise por nome, fórmula, SMILES ou uso..."
        />
      </div>

      <button 
        onClick={handleSearch}
        disabled={loading}
        className="px-10 py-2 bg-[#0F7A73] text-white rounded-lg shadow-md transition hover:bg-[#0A5A53] disabled:bg-gray-400 font-medium"
      >
        {loading ? 'Buscando...' : 'Pesquisar'}
      </button>

      <div className="w-full max-w-xl mt-4">
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
            ⚠️ Erro ao conectar com o servidor. Verifique se o backend está rodando.
          </div>
        )}

        {/* Agora esta mensagem some assim que handleInputChange é disparado */}
        {searchPerformed && results.length === 0 && !error && (
          <div className="p-6 bg-gray-50 border border-dashed border-gray-300 text-gray-500 rounded-lg text-center italic">
            Não encontramos nenhuma substância para "{searchTerm}". <br/>
            Tente outros termos ou verifique a ortografia.
          </div>
        )}

        {results.length > 0 && (
          <div className="flex flex-col gap-2">
            {results.map((item) => (
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
                    <span className="text-gray-400 text-xs font-medium">Ver detalhes →</span>
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