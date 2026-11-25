import { Navigate, Route, Routes } from 'react-router-dom'
import RotaProtegida from './auth/RotaProtegida'
import RotaVisitante from './auth/RotaVisitante'
import LayoutApp from './components/LayoutApp'
import LayoutAuth from './components/LayoutAuth'
import CriarConta from './pages/CriarConta'
import Dependentes from './pages/Dependentes'
import EmBreve from './pages/EmBreve'
import Entrar from './pages/Entrar'
import Inicio from './pages/Inicio'
import MinhaArea from './pages/MinhaArea'
import Caderneta from './pages/Caderneta'

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

      {/* só para quem está logado; todas as telas ganham o menu lateral */}
      <Route element={<RotaProtegida />}>
        <Route element={<LayoutApp />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/caderneta" element={<Caderneta />} />
          <Route path="/minha-area" element={<MinhaArea />} />
          <Route path="/dependentes" element={<Dependentes />} />
          <Route path="/notificacoes" element={<EmBreve titulo="Notificações" />} />
        </Route>
      </Route>

      {/* qualquer outro endereço volta para o início */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}