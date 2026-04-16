import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MoleculeDisplay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [moleculeData, setMoleculeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMoleculeData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`https://natura-predict.onrender.com/public/substances/${id}`);
        setMoleculeData(response.data);
      } catch (err) {
        console.error("Erro ao buscar detalhes:", err);
        setError("Não foi possível conectar ao servidor.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchMoleculeData();
  }, [id]);

  if (isLoading) return <div className="text-center p-20 text-[#0F7A73]">Carregando ficha técnica...</div>;
  
  if (error || !moleculeData) {
    return (
      <div className="text-center p-20">
        <p className="text-red-600 font-bold">{error || "Substância não encontrada."}</p>
        <button onClick={() => navigate('/')} className="mt-4 text-[#0F7A73] underline">Voltar para a busca</button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-5xl mx-auto my-10 border border-gray-100">
      <button 
        onClick={() => navigate(-1)} 
        className="text-[#0F7A73] mb-6 hover:font-bold transition-all flex items-center gap-2"
      >
        ← Voltar
      </button>

      <div className="border-b-4 border-[#0F7A73] mb-8 pb-4">
        <h1 className="text-4xl font-extrabold text-[#0F7A73] capitalize">
          {moleculeData.nome}
        </h1>
        <p className="text-gray-500 italic mt-1 text-lg">{moleculeData.nome_quimico}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Lado Esquerdo: Identificação e Química */}
        <div className="space-y-6">
          <section className="bg-slate-50 p-5 rounded-lg border-l-4 border-teal-500">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Fórmula Molecular</h2>
            <p className="text-xl font-semibold text-gray-800">{moleculeData.formula_molecular}</p>
          </section>

          <section className="bg-slate-50 p-5 rounded-lg border-l-4 border-teal-500">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Estrutura SMILES</h2>
            <p className="text-sm font-mono break-all bg-white p-3 rounded border text-gray-700">
              {moleculeData.smile}
            </p>
          </section>

          <section className="bg-slate-50 p-5 rounded-lg border-l-4 border-teal-500">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Propriedades Físico-Químicas</h2>
            <p className="text-gray-700 leading-relaxed">{moleculeData.propriedades_fisico_quimicas}</p>
          </section>
        </div>

        {/* Lado Direito: Biologia e Uso */}
        <div className="space-y-6">
          <section className="bg-teal-50 p-5 rounded-lg border-l-4 border-[#0F7A73]">
            <h2 className="text-sm font-bold text-[#0F7A73] uppercase tracking-widest mb-2">Atividade Biológica</h2>
            <p className="text-gray-700 leading-relaxed font-medium">{moleculeData.atividade_biologica}</p>
          </section>

          <section className="bg-teal-50 p-5 rounded-lg border-l-4 border-[#0F7A73]">
            <h2 className="text-sm font-bold text-[#0F7A73] uppercase tracking-widest mb-2">Origem / Ocorrência</h2>
            <p className="text-gray-700 leading-relaxed">{moleculeData.origem}</p>
          </section>

          <section className="bg-teal-50 p-5 rounded-lg border-l-4 border-[#0F7A73]">
            <h2 className="text-sm font-bold text-[#0F7A73] uppercase tracking-widest mb-2">Uso Tradicional</h2>
            <p className="text-gray-700 leading-relaxed italic">{moleculeData.uso_tradicional}</p>
          </section>
        </div>

      </div>

      <div className="mt-10 text-center text-xs text-gray-400 border-t pt-4">
        ID Interno: {moleculeData.id} | Dados extraídos do banco NaturaPREDICT
      </div>
    </div>
  );
};

export default MoleculeDisplay;