import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Navegacao() {
  const [substances, setSubstances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubstances = async () => {
      try {
        // Usamos a mesma rota pública que o seu Painel usa para listar
        const response = await axios.get('http://localhost:3000/public/substances');
        setSubstances(response.data);
      } catch (error) {
        console.error("Erro ao carregar substâncias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubstances();
  }, []);

  if (loading) return <div className="p-20 text-center text-teal-700 font-bold">Carregando catálogo...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-light text-[#0F7A73] mb-8 border-b pb-4">
        Catálogo de Ativos Naturais
      </h1>

      {/* Grid de Cards para uma visualização mais amigável que a tabela do admin */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {substances.map((sub) => (
          <Link 
            to={`/substance/${sub.id}`} 
            key={sub.id} 
            className="group block bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#0F7A73] transition-all"
          >
            <h2 className="text-xl font-bold text-[#0F7A73] group-hover:underline mb-2">
              {sub.nome}
            </h2>
            <p className="text-sm text-gray-600 mb-4 italic">
              {sub.origem}
            </p>
            <div className="text-xs text-gray-400 font-mono">
              {sub.formula_molecular}
            </div>
            <div className="mt-4 text-right text-[#0F7A73] font-medium text-sm">
              Ver ficha técnica →
            </div>
          </Link>
        ))}
      </div>

      {substances.length === 0 && (
        <div className="text-center p-20 text-gray-500">
          Nenhuma substância cadastrada no momento.
        </div>
      )}
    </div>
  );
}

export default Navegacao;