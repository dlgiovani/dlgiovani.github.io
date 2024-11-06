import React from "react";

const Info = ({ projectsCount, theme, handleChangeTheme }) => {

  return (
    <section className="flex flex-col items-start">
      <p className="font-semibold">giovani@pages</p>
      <p className="">-----------</p>
      <p className="flex gap-1">
        <span className="text-secondary-content bg-secondary font-semibold">Onde:</span>
        <span className="text-primary-content">Curitiba, Brasil</span>
      </p>
      <p className="flex gap-1">
        <span className="text-secondary-content bg-secondary font-semibold">O quê:</span>
        <span className="text-primary-content">Backend metido a Fullstack</span>
      </p>
      <p className="flex gap-1">
        <span className="text-secondary-content bg-secondary font-semibold">Nível:</span>
        <span className="text-primary-content">Pleno</span>
      </p>
      <p className="flex gap-1 w-[80%]">
        <span className="text-secondary-content bg-secondary font-semibold">Tema:</span>
        <span className="text-primary-content flex items-center justify-between w-full gap-2">
          <span onClick={() => handleChangeTheme(-1)} className="select-none font-bold cursor-pointer text-xl material-symbols-outlined">arrow_back</span>
          <span className="bg-primary text-primary-content">{theme}</span>
          <span onClick={() => handleChangeTheme(1)} className="select-none font-bold cursor-pointer text-xl material-symbols-outlined">arrow_forward</span>
        </span>
      </p>
      <p className="flex gap-1">
        <span className="text-secondary-content bg-secondary font-semibold">Projetos:</span>
        <span className="text-primary-content">&gt;{projectsCount}</span>
      </p>
      <p className="flex gap-1">
        <span className="text-secondary-content bg-secondary font-semibold">Certificado:</span>
        <span className="text-primary-content">
          <a className="underline"
          href="https://courses.edx.org/certificates/daa8e0573d574d43a5f24451aec18d61" target="_blank">
            Harvard
          </a>
        </span>
      </p>
      <p className="flex gap-1">
        <span className="text-secondary-content bg-secondary font-semibold">Currículo:</span>
        <span className="text-primary-content">
          <a className="underline"
          href="/cv-giovani-drosda-lima-ptbr.pdf" target="_blank">
            ver pdf
          </a>
        </span>
      </p>
      <div className="mt-4 flex flex-col">
        <div className="flex self-center w-full">
          <div className="flex-grow bg-accent text-accent-content p-1 text-sm">python</div>
          <div className="flex-grow bg-secondary text-secondary-content p-1 text-sm">fastapi</div>
          <div className="flex-grow bg-neutral text-neutral-content p-1 text-sm">django</div>
          <div className="flex-grow bg-primary text-primary-content p-1 text-sm">rest</div>
        </div>
        <div className="flex self-center w-full">
          <div className="flex-grow bg-neutral text-neutral-content p-1 text-sm">alembic</div>
          <div className="flex-grow bg-accent text-accent-content p-1 text-sm">node.js</div>
          <div className="flex-grow bg-primary text-primary-content p-1 text-sm">pydantic</div>
          <div className="flex-grow bg-secondary text-secondary-content p-1 text-sm">sqlalchemy</div>
        </div>
        <div className="flex self-center w-full">
          <div className="flex-grow bg-primary text-primary-content p-1 text-sm">postgre/sql</div>
          <div className="flex-grow bg-secondary text-secondary-content p-1 text-sm">js/ts</div>
          <div className="flex-grow bg-accent text-accent-content p-1 text-sm">react</div>
          <div className="flex-grow bg-neutral text-neutral-content p-1 text-sm">apis</div>
        </div>
      </div>
    </section>
  )
}

export default Info;
