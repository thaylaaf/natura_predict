import React, { useState } from 'react';

const MoleculeTest = () => {
  // Dados de teste para exibir o layout
  const [moleculeData] = useState({
    name: "Cafeína",
    chemicalStructure: "A Cafeína é um alcaloide da xantina com a fórmula química C₈H₁₀N₄O₂. Sua estrutura é baseada em um anel de purina...",
    pharmacologicalProperties: "Atua como um antagonista não seletivo dos receptores de adenosina no sistema nervoso central, o que resulta em maior estado de alerta, redução da fadiga...",
    origin: "Encontrada em mais de 60 espécies de plantas, como os grãos de café, folhas de chá, sementes de cacau, guaraná e mate. Serve como um pesticida natural para a planta...",
    traditionalUse: "Historicamente, o café foi usado na África e Oriente Médio, o chá na Ásia, e o cacau na Mesoamérica para rituais, medicina e para manter a energia em longas jornadas..."
  });

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-[#0F7A73] mb-6 border-b-2 border-gray-200 pb-2">
        {moleculeData.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Seção de Estrutura Química */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
            Estrutura Química
          </h2>
          <p className="text-gray-700 leading-relaxed">{moleculeData.chemicalStructure}</p>
        </div>

        {/* Seção de Propriedades Farmacológicas */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
            Propriedades Farmacológicas
          </h2>
          <p className="text-gray-700 leading-relaxed">{moleculeData.pharmacologicalProperties}</p>
        </div>

        {/* Seção de Origem */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
            Origem
          </h2>
          <p className="text-gray-700 leading-relaxed">{moleculeData.origin}</p>
        </div>

        {/* Seção de Uso Tradicional */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
            Uso Tradicional
          </h2>
          <p className="text-gray-700 leading-relaxed">{moleculeData.traditionalUse}</p>
        </div>
      </div>
    </div>
  );
};

export default MoleculeTest;