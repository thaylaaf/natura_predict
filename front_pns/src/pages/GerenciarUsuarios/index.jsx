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
      navigate('/painel'); // Volta se não for super_admin
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

  // 🗑️ DELETAR USUÁRIO (Igual lógica das substâncias)
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
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <button 
            onClick={() => navigate('/PainelControle')} 
            className="text-teal-700 hover:underline mb-2 block"
          >
            ← Voltar ao Painel
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Administradores do Sistema</h1>
        </div>
      </div>

      {/* TABELA - MESMO ESTILO DA TABELA DE SUBSTÂNCIAS */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border">
        <table className="w-full text-left">
          <thead className="bg-gray-100 font-bold">
            <tr>
              <th className="p-4 border-b">Nome</th>
              <th className="p-4 border-b">E-mail</th>
              <th className="p-4 border-b">Nível</th>
              <th className="p-4 border-b text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 border-b">
                <td className="p-4">{user.nome}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4 capitalize">{user.nivel.replace('_', ' ')}</td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => handleDelete(user.id)} 
                    className="text-red-600 hover:underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {usuarios.length === 0 && (
          <div className="p-10 text-center text-gray-400">Nenhum administrador encontrado.</div>
        )}
      </div>
    </div>
  );
}

export default GerenciarUsuarios;