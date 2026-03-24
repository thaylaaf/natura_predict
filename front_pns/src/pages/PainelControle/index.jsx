import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PainelControle() {
  const [substances, setSubstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Estados para Edição
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubstance, setCurrentSubstance] = useState(null);

  // Estados para Cadastro
  const [isAdding, setIsAdding] = useState(false);
  const [newSubstance, setNewSubstance] = useState({
    nome: '',
    nome_quimico: '',
    formula_molecular: '',
    smile: '',
    propriedades_fisico_quimicas: '', // Nome atualizado
    atividade_biologica: '',          // Campo novo
    origem: '',
    uso_tradicional: ''
  });

  // 🛡️ SEGURANÇA
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  // 🔍 BUSCA
  const fetchSubstances = async () => {
    try {
      const response = await axios.get('http://localhost:3000/public/substances');
      setSubstances(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubstances(); }, []);

  // 🗑️ DELETAR
  const handleDelete = async (id) => {
    if (!confirm("Excluir substância?")) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3000/substances/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSubstances();
    } catch (error) { alert("Erro ao remover."); }
  };

  // 📝 SALVAR EDIÇÃO (PUT)
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:3000/substances/${currentSubstance.id}`, currentSubstance, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      fetchSubstances();
    } catch (error) { alert("Erro ao editar."); }
  };

  // ➕ SALVAR NOVO CADASTRO (POST)
  const handleSaveNew = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:3000/substances', newSubstance, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Substância cadastrada com sucesso!");
      setIsAdding(false);
      // Reset do formulário com os novos campos
      setNewSubstance({ 
        nome: '', nome_quimico: '', formula_molecular: '', smile: '', 
        propriedades_fisico_quimicas: '', atividade_biologica: '', 
        origem: '', uso_tradicional: '' 
      });
      fetchSubstances();
    } catch (error) {
      alert(error.response?.data?.erro || "Erro ao cadastrar. Verifique os campos.");
    }
  };

  if (loading) return <div className="p-10 text-center">Carregando...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Painel de Controle</h1>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition"
        >
          + Nova Substância
        </button>
      </div>

      {/* MODAL DE CADASTRO */}
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <form onSubmit={handleSaveNew} className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl space-y-4 my-8">
            <h2 className="text-xl font-bold text-teal-700 border-b pb-2">Cadastrar Nova Substância</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Nome Comum" className="border p-2 rounded" onChange={(e) => setNewSubstance({...newSubstance, nome: e.target.value})} required />
              <input placeholder="Nome Químico" className="border p-2 rounded" onChange={(e) => setNewSubstance({...newSubstance, nome_quimico: e.target.value})} required />
              <input placeholder="Fórmula Molecular" className="border p-2 rounded" onChange={(e) => setNewSubstance({...newSubstance, formula_molecular: e.target.value})} required />
              <input placeholder="SMILE" className="border p-2 rounded" onChange={(e) => setNewSubstance({...newSubstance, smile: e.target.value})} required />
            </div>
            <input placeholder="Origem / Família" className="w-full border p-2 rounded" onChange={(e) => setNewSubstance({...newSubstance, origem: e.target.value})} required />
            <textarea placeholder="Propriedades Físico-Químicas" className="w-full border p-2 rounded h-20" onChange={(e) => setNewSubstance({...newSubstance, propriedades_fisico_quimicas: e.target.value})} required />
            <textarea placeholder="Atividade Biológica" className="w-full border p-2 rounded h-20" onChange={(e) => setNewSubstance({...newSubstance, atividade_biologica: e.target.value})} required />
            <textarea placeholder="Uso Tradicional" className="w-full border p-2 rounded h-20" onChange={(e) => setNewSubstance({...newSubstance, uso_tradicional: e.target.value})} required />
            <div className="flex space-x-3 pt-4 border-t">
              <button type="submit" className="flex-1 bg-teal-700 text-white font-bold py-2 rounded">Cadastrar</button>
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-gray-200 py-2 rounded">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL DE EDIÇÃO */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <form onSubmit={handleSaveEdit} className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl space-y-4 my-8">
            <h2 className="text-xl font-bold text-teal-700 border-b pb-2">Editar Substância</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="border p-2 rounded" value={currentSubstance.nome} onChange={(e) => setCurrentSubstance({...currentSubstance, nome: e.target.value})} />
              <input className="border p-2 rounded" value={currentSubstance.nome_quimico} onChange={(e) => setCurrentSubstance({...currentSubstance, nome_quimico: e.target.value})} />
              <input className="border p-2 rounded" value={currentSubstance.formula_molecular} onChange={(e) => setCurrentSubstance({...currentSubstance, formula_molecular: e.target.value})} />
              <input className="border p-2 rounded" value={currentSubstance.smile} onChange={(e) => setCurrentSubstance({...currentSubstance, smile: e.target.value})} />
            </div>
            <input className="w-full border p-2 rounded" value={currentSubstance.origem} onChange={(e) => setCurrentSubstance({...currentSubstance, origem: e.target.value})} />
            <textarea className="w-full border p-2 rounded h-20" value={currentSubstance.propriedades_fisico_quimicas} onChange={(e) => setCurrentSubstance({...currentSubstance, propriedades_fisico_quimicas: e.target.value})} />
            <textarea className="w-full border p-2 rounded h-20" value={currentSubstance.atividade_biologica} onChange={(e) => setCurrentSubstance({...currentSubstance, atividade_biologica: e.target.value})} />
            <textarea className="w-full border p-2 rounded h-20" value={currentSubstance.uso_tradicional} onChange={(e) => setCurrentSubstance({...currentSubstance, uso_tradicional: e.target.value})} />
            <div className="flex space-x-3 pt-4 border-t">
              <button type="submit" className="flex-1 bg-teal-700 text-white font-bold py-2 rounded">Salvar Alterações</button>
              <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-gray-200 py-2 rounded">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* TABELA */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border">
        <table className="w-full text-left">
          <thead className="bg-gray-100 font-bold">
            <tr>
              <th className="p-4 border-b">Nome</th>
              <th className="p-4 border-b">Origem</th>
              <th className="p-4 border-b text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {substances.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50 border-b">
                <td className="p-4">{sub.nome}</td>
                <td className="p-4">{sub.origem}</td>
                <td className="p-4 text-center space-x-4">
                  <button onClick={() => { setCurrentSubstance(sub); setIsEditing(true); }} className="text-blue-600 hover:underline">Editar</button>
                  <button onClick={() => handleDelete(sub.id)} className="text-red-600 hover:underline">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PainelControle;