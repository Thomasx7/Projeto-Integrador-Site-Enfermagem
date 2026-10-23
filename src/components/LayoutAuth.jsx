import { Link, Outlet, useLocation } from 'react-router-dom'

// Moldura do login e do cadastro: um cartão com o painel do mar à esquerda e o formulário à direita
export default function LayoutAuth() {
  const { pathname } = useLocation() // endereço atual: /entrar ou /criar-conta
  const entrando = pathname === '/entrar'

  return (
    <div className="auth">
      <div className="auth__cartao">
        <section className="auth__marca">
          <p className="auth__nome">Minha Caderneta</p>

          {/* o texto do painel muda conforme a tela e convida a pessoa para a outra */}
          <div className="auth__texto">
            <h2>{entrando ? 'Primeira vez por aqui?' : 'Já tem uma conta?'}</h2>
            <p>
              {entrando
                ? 'Crie sua conta e acompanhe as vacinas de toda a família.'
                : 'Entre para ver sua caderneta e as vacinas que faltam.'}
            </p>
            <Link className="auth__trocar" to={entrando ? '/criar-conta' : '/entrar'}>
              {entrando ? 'Criar conta' : 'Entrar'}
            </Link>
          </div>

          
        </section>

        <div className="auth__form">
          <div className="auth__conteudo">
            <Outlet /> {/* aqui entra a tela de Entrar ou de Criar conta */}
          </div>
        </div>
      </div>
    </div>
  )
}