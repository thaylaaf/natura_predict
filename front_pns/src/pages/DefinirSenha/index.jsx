import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AtualizarSenha() {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  // Bloqueia acesso se não houver token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Validação de igualdade
    if (novaSenha !== confirmarSenha) {
      return setError('As senhas não coincidem.');
    }

    // 2. Validação de Força da Senha (REGEX)
    // Pelo menos 6 caracteres, 1 Maiúscula, 1 Número e 1 Caractere Especial
    const senhaForteRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+={}\[\]:;<>|./?-]).{6,}$/;
    
    if (!senhaForteRegex.test(novaSenha)) {
      return setError('A senha deve ter no mínimo 6 caracteres, incluir uma letra maiúscula, um número e um caractere especial (ex: @, #, $).');
    }

    try {
      const token = localStorage.getItem('token');
      
      // 3. Envio para o backend
      await axios.put('http://localhost:3000/auth/atualizar-senha', 
        { novaSenha: novaSenha },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(true);
      
      // IMPORTANTE: Limpamos os dados antigos para forçar o sistema a reconhecer o novo status no próximo login
      // ou atualizamos o localStorage se o seu App depender disso globalmente.
      localStorage.setItem('mudar_senha', 'false');

      setTimeout(() => {
        // Sugestão: Redirecionar para o Login para o usuário validar a nova senha
        // Ou para o Painel, caso você já tenha o token válido.
        navigate('/PainelControle'); 
      }, 2000);

    } catch (err) {
      const mensagemErro = err.response?.data?.erro || 'Erro ao atualizar senha.';
      setError(mensagemErro);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Definir <span className="text-teal-700">Nova Senha</span>
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sua senha deve conter letra maiúscula, número e caractere especial.
            </p>

            {error && (
              <p className="mt-4 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100">
                {error}
              </p>
            )}
            
            {success && (
              <div className="mt-4 text-sm text-green-700 bg-green-50 p-3 rounded border border-green-100">
                Senha atualizada com sucesso! Entrando no sistema...
              </div>
            )}
          </div>

          {!success && (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
                  <input
                    type="password"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    placeholder="********"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    placeholder="********"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-700 hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all"
              >
                Atualizar Senha
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default AtualizarSenha;