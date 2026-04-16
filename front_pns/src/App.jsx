import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchContainer from './containers/SearchContainer';
import MoleculeDisplay from './components/MoleculeDisplay';
import Home from './pages/Home';
import Login from './pages/login/index';
import PainelControle from './pages/PainelControle';
import Navegacao from './pages/Navegacao';
import DefinirSenha from './pages/DefinirSenha';
import GerenciarUsuarios from './pages/GerenciarUsuarios';

// Importe seu Header e Footer aqui (ajuste o caminho se necessário)
import Header from './components/Header'; 
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen"> {/* Garante que o footer fique no fundo */}
        
        <Header /> {/* Aparecerá em todas as páginas */}

        <main className="flex-grow"> {/* O conteúdo das páginas entra aqui */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/PainelControle" element={<PainelControle />} />
            <Route path="/substance/:id" element={<MoleculeDisplay />} />
            <Route path="/Navegacao" element={<Navegacao />} />
            <Route path="/DefinirSenha" element={<DefinirSenha />} />
            <Route path="/usuarios" element={<GerenciarUsuarios />} />
          </Routes>
        </main>

        <Footer /> {/* Aparecerá em todas as páginas */}
        
      </div>
    </Router>
  );
}

export default App;