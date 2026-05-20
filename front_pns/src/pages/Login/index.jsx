import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    try {
      const response = await axios.post('http://localhost:3000/login', {
        email: email,
        senha: password 
      });

      // 1. Capturamos o 'mudar_senha' que vem do backend atualizado
      const { token, nome, nivel, mudar_senha } = response.data;

      // 2. Guardamos os dados no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('usuarioNome', nome);
      localStorage.setItem('nivel', nivel);

      // 3. Lógica de Redirecionamento:
      if (mudar_senha === true) {
        // Se for o primeiro acesso, manda para definir nova senha
        navigate('/DefinirSenha'); 
      } else {
        // Se já mudou a senha antes, vai para o painel normal
        navigate('/PainelControle');
      }
      
    } catch (err) {
      const mensagemErro = err.response?.data?.erro || 'Erro ao conectar ao servidor';
      setError(mensagemErro);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Acesse o <span className="text-teal-700">NaturaPREDICT</span>
            </h2>
            {error && <p className="mt-2 text-center text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                <input
                  type="email"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-700 hover:bg-teal-800 transition-colors"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Login;