import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const About = () => {

  const language = useLanguage();

  return (
    <>
      <button className='flex items-center btn btn-ghost drop-shadow text-sm md:text-base' onClick={() => {
        const modal = document.getElementById('about_modal') as HTMLDialogElement;
        modal?.showModal();
      }}>
        <span className="capitalize">{language.translate("about")}</span>
        <span className="material-symbols-outlined text-sm md:text-lg">lightbulb</span>
      </button>

      <dialog id="about_modal" className="modal">
        <div className="modal-box text-left text-pretty">
          <div className="flex gap-2 items-end">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="rounded-full w-4 h-4 bg-error mb-6 left-2 top-2"></button>
            </form>
            <button className="rounded-full w-4 h-4 bg-neutral mb-6 left-2 top-2"></button>
            <button className="rounded-full w-4 h-4 bg-neutral mb-6 left-2 top-2"></button>
          </div>
          {language.currentLanguage === 'ptbr' &&
            <>
              <h3 className="font-bold text-lg">Olá, eu sou o Giovani</h3>
              <p className="py-4">Eu mexo com tecnologia desde 2017, já trabalhei no setor de TI do Exército Brasileiro e programei sistemas e integrações para grandes empresas de tecnologia e telecomunicações. Atualmente trabalho como analista de TI e programador.</p>
              <p className="py-4">Venho me especializando no momento em APIs REST e Oauth2. Crio webapps completos do zero com FastAPI e React (às vezes Node), com grande foco na experiência do usuário.</p>
              <p className="py-4 code text-xs">eu uso arch btw</p>
              <p className="py-4 font-thin">Pressione ESC ou clique fora para sair...</p>
            </>
          }
          {language.currentLanguage === 'en' &&
            <>
              <h3 className="font-bold text-lg">Hi, my name is Giovani</h3>
              <p className="py-4">I deal with tech since 2017, I've worked at the IT Section of the Brazilian Army and coded systems and integrations to big tech and telecommunications companies. Currently I work as a programmer and IT Analyst.</p>
              <p className="py-4">At the moment I'm specializing myself on REST APIs and OAuth2. I create complete webapps from the ground up with FastAPI and React, with a big focus on User Experience.</p>
              <p className="py-4 code text-xs">i use arch btw</p>
              <p className="py-4 font-thin">Press ESC or click outside to exit...</p>
            </>
          }
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default About;