const About = () => {

  return (
    <>
      <button className='!-rotate-90 flex items-center btn btn-ghost drop-shadow' onClick={() => document.getElementById('about_modal').showModal()}>
        <span>Sobre</span>
        <span className="material-symbols-outlined">lightbulb</span>
      </button>

      <dialog id="about_modal" className="modal">
        <div className="modal-box text-left text-pretty">
          <h3 className="font-bold text-lg">Olá, eu sou o Giovani</h3>
          <p className="py-4">Sou um programador fullstack com quase uma década de experiência em programação e ~3 anos em desenvolvimento profissional de software.</p>
          <p className="py-4">Venho me especializando no momento em APIs REST e Oauth2. Crio webapps completos do zero com FastAPI e React, com grande foco na experiência do usuário.</p>
          <p className="py-4 font-thin">Pressione ESC ou clique fora para sair...</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default About;