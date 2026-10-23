import { Navigate, Route, Routes } from 'react-router-dom'
import RotaProtegida from './auth/RotaProtegida'
import RotaVisitante from './auth/RotaVisitante'
import LayoutAuth from './components/LayoutAuth'
import CriarConta from './pages/CriarConta'
import Entrar from './pages/Entrar'
import Inicio from './pages/Inicio'

// Decide qual tela aparece em cada endereço do site
export default function App() {
  return (
    <Routes>
      {/* só para quem NÃO está logado, dentro da moldura do painel do mar */}
      <Route element={<RotaVisitante />}>
        <Route element={<LayoutAuth />}>
          <Route path="/entrar" element={<Entrar />} />
          <Route path="/criar-conta" element={<CriarConta />} />
        </Route>
      </Route>

      {/* só para quem está logado */}
      <Route element={<RotaProtegida />}>
        <Route path="/" element={<Inicio />} />
      </Route>

      {/* qualquer outro endereço volta para o início */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}