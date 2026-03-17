import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchContainer from './containers/SearchContainer';
import MoleculeDisplay from './components/MoleculeDisplay';
import Home from './pages/Home';

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
            <Route path="/substance/:id" element={<MoleculeDisplay />} />
          </Routes>
        </main>

        <Footer /> {/* Aparecerá em todas as páginas */}
        
      </div>
    </Router>
  );
}

export default App;