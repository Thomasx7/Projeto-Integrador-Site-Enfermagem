import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import AlarmeRemedios from './AlarmeRemedios'
import './layout.css'

// Itens do menu: para mudar o menu, mexa só aqui
const ITENS = [
  { para: '/', texto: 'Início', fim: true },
  { para: '/caderneta', texto: 'Caderneta de Vacinação' },
  { para: '/minha-area', texto: 'Minha área' },
  { para: '/cronicas', texto: 'Doenças e remédios' },
  { para: '/dependentes', texto: 'Dependentes' },
  { para: '/notificacoes', texto: 'Notificações' },
]

export default function LayoutApp() {
  const { sair } = useAuth()

  return (
    <div className="app">
      {/* Avisa a hora dos remédios em qualquer tela (com o site aberto) */}
      <AlarmeRemedios />
      <nav className="menu" aria-label="Menu principal">
        <p className="menu-marca">P.I Enfermagem</p>
        {ITENS.map((item) => (
          // NavLink marca sozinho o item da página atual (classe "ativo")
          <NavLink
            key={item.para}
            to={item.para}
            end={item.fim}
            className={({ isActive }) => (isActive ? 'menu-item ativo' : 'menu-item')}
          >
            {item.texto}
          </NavLink>
        ))}
        <button className="menu-sair" onClick={sair}>Sair</button>
      </nav>

      {/* Aqui entra a página da rota atual */}
      <main className="conteudo">
        <Outlet />
      </main>
    </div>
  )
}