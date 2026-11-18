import { useState } from 'react'

// Campo de senha com botão para mostrar ou esconder o que foi digitado
export default function CampoSenha({ id = 'senha', rotulo = 'Senha', ...resto }) {
  // visivel = true mostra as letras; false mostra as bolinhas
  const [visivel, setVisivel] = useState(false)

  return (
    <>
      <label htmlFor={id}>{rotulo}</label>
      <div className="campo-senha">
        {/* "resto" repassa tudo o que a tela mandar: value, onChange, autoComplete, required... */}
        <input id={id} type={visivel ? 'text' : 'password'} {...resto} />
        <button type="button" className="campo-senha__botao" onClick={() => setVisivel(!visivel)}>
          {visivel ? 'Esconder' : 'Mostrar'}
        </button>
      </div>
    </>
  )
}