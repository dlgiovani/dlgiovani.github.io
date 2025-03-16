import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const Info = ({ projectsCount, theme, handleChangeTheme }) => {

  const language = useLanguage();

  return (
    <section className="flex flex-col items-start [&>p]:rounded-box [&>p>span:first-child]:rounded-box gap-1">
      <p className="text-primary-content bg-primary font-semibold mt-1 lg:mt-0 px-1">giovani@pages</p>
      <p className="">-----------</p>
      <p className="flex gap-1 w-full">
        <span className="text-start text-primary-content bg-primary font-semibold capitalize flex-grow max-w-[35%] pl-1">{language.translate("where")}:</span>
        <span className="text-primary-content">Curitiba, Brasil</span>
      </p>
      <p className="flex gap-1 w-full">
        <span className="text-start text-primary-content bg-primary font-semibold capitalize flex-grow max-w-[35%] pl-1">{language.translate("what")}:</span>
        <span className="text-primary-content">{language.translate("my_profession")}</span>
      </p>
      <p className="flex gap-1 w-full">
        <span className="text-start text-primary-content bg-primary font-semibold capitalize flex-grow max-w-[35%] pl-1">{language.translate("seniority")}:</span>
        <span className="text-primary-content">{language.translate("mid-level")}</span>
      </p>
      <p className="flex gap-1 w-full">
        <span className="text-start text-primary-content bg-primary font-semibold capitalize flex-grow max-w-[35%] pl-1">{language.translate("theme")}:</span>
        <span className="text-primary-content flex w-[64%] items-center justify-between gap-2">
          <span onClick={() => handleChangeTheme(-1)} className="select-none font-bold cursor-pointer text-xl material-symbols-outlined">arrow_back</span>
          <span className="bg-primary text-primary-content">{theme}</span>
          <span onClick={() => handleChangeTheme(1)} className="select-none font-bold cursor-pointer text-xl material-symbols-outlined">arrow_forward</span>
        </span>
      </p>
      <p className="flex gap-1 w-full">
        <span className="text-start text-primary-content bg-primary font-semibold capitalize flex-grow max-w-[35%] pl-1">{language.translate("projects")}:</span>
        <span className="text-primary-content">&gt;{projectsCount}</span>
      </p>

      <div className="flex gap-1 flex-row mt-3 [&>*]:flex [&>*]:items-center [&>*]:gap-1">
        <a href="https://courses.edx.org/certificates/daa8e0573d574d43a5f24451aec18d61" 
        className="text-primary-content bg-primary rounded-box p-1">
          <img className="h-6" src="Harvard_University_coat_of_arms.png" alt={language.translate("certificate")} />
          <span className="capitalize taxt-sm hidden md:inline-block">{language.translate("certificate")}</span>
        </a>

        <a href={`/cv-giovani-drosda-lima-${language.currentLanguage}.pdf`} 
        className="text-primary-content bg-primary rounded-box p-1">
        <span className="material-symbols-outlined">clinical_notes</span>
        <span className="hidden md:inline-block">{language.translate("curriculum")}</span>
        </a>
        
        <a href="mailto:contatogiovanidl@gmail.com" className="text-primary-content bg-primary rounded-box p-1">
          <span className="material-symbols-outlined">mail</span>
          <span className="hidden md:inline-block">{language.translate("email")}</span>
        </a>
      </div>

      <div className="mt-3 flex flex-col">
        <div className="flex self-center w-full">
          <div className="flex-grow bg-accent/50 text-accent-content p-1 text-sm">python</div>
          <div className="flex-grow bg-secondary text-secondary-content p-1 text-sm">fastapi</div>
          <div className="flex-grow bg-neutral text-neutral-content p-1 text-sm">django</div>
          <div className="flex-grow bg-primary text-primary-content p-1 text-sm">rest</div>
        </div>
        <div className="flex self-center w-full">
          <div className="flex-grow bg-neutral text-neutral-content p-1 text-sm">alembic</div>
          <div className="flex-grow bg-accent/50 text-accent-content p-1 text-sm">node.js</div>
          <div className="flex-grow bg-primary text-primary-content p-1 text-sm">pydantic</div>
          <div className="flex-grow bg-secondary text-secondary-content p-1 text-sm">sqlalchemy</div>
        </div>
        <div className="flex self-center w-full">
          <div className="flex-grow bg-primary text-primary-content p-1 text-sm">postgre/sql</div>
          <div className="flex-grow bg-secondary text-secondary-content p-1 text-sm">js/ts</div>
          <div className="flex-grow bg-accent/50 text-accent-content p-1 text-sm">react</div>
          <div className="flex-grow bg-neutral text-neutral-content p-1 text-sm">apis</div>
        </div>
      </div>
    </section>
  )
}

export default Info;
