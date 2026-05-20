import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🛡️ SEGURANÇA: Só Super Admin entra aqui
  useEffect(() => {
    const token = localStorage.getItem('token');
    const nivel = localStorage.getItem('nivel');
    if (!token || nivel !== 'super_administrador') {
      navigate('/PainelControle'); // Ajustado para a rota correta que você usa
    }
  }, [navigate]);

  const fetchUsuarios = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:3000/admins', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsuarios(); }, []);

  // 🗑️ DELETAR USUÁRIO
  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja remover este administrador?")) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3000/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsuarios(); // Recarrega a lista
    } catch (error) {
      alert("Erro ao remover usuário.");
    }
  };

  if (loading) return <div className="p-10 text-center">Carregando usuários...</div>;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <button 
            onClick={() => navigate('/PainelControle')} 
            className="text-teal-700 hover:underline mb-2 flex items-center gap-1 text-sm md:text-base"
          >
            ← <span className="hidden sm:inline">Voltar ao Painel</span>
            <span className="sm:hidden">Voltar</span>
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Administradores do Sistema</h1>
        </div>
      </div>

      {/* ATUALIZAÇÃO DE RESPONSIVIDADE:
          O container abaixo permite o scroll horizontal apenas na tabela 
      */}
      <div className="bg-white shadow-md rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-gray-100 font-bold">
              <tr>
                <th className="p-4 border-b text-sm md:text-base">Nome</th>
                <th className="p-4 border-b text-sm md:text-base">E-mail</th>
                <th className="p-4 border-b text-sm md:text-base">Nível</th>
                <th className="p-4 border-b text-center text-sm md:text-base">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 border-b">
                  <td className="p-4 text-sm whitespace-nowrap">{user.nome}</td>
                  <td className="p-4 text-sm">{user.email}</td>
                  <td className="p-4 text-sm capitalize">
                    {user.nivel ? user.nivel.replace('_', ' ') : ''}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleDelete(user.id)} 
                      className="text-red-600 hover:underline text-sm font-medium"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {usuarios.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            Nenhum administrador encontrado.
          </div>
        )}
      </div>

      {/* Aviso visual para o usuário mobile */}
      <p className="text-[10px] text-gray-400 mt-2 text-center sm:hidden italic">
        * Deslize para o lado para ver todas as informações
      </p>
    </div>
  );
}

export default GerenciarUsuarios;