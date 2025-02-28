// import { useLanguage } from "../contexts/LanguageContext";

const Buttons = () => {

  // const language = useLanguage();

  return (
    <div className='w-fit flex mt-6 lg:mt-0 justify-center gap-4 text-sm md:text-base'>
      <a target='_blank' href='https://www.linkedin.com/in/giovani-drosda-lima/'
        className='btn btn-primary md:justify-start capitalize'>Linkedin</a>
      <a href="https://api.whatsapp.com/send?phone=[      ]&text=Ol%C3%A1,%20Giovani!%0A%0AVi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar."
        target='_blank'
        className='btn btn-ghost bg-primary/5 md:justify-start'>
        <span className="material-symbols-outlined">
          chat
        </span>
        <span className="hidden md:block">
          Whatsapp
        </span>
      </a>
      <a href='https://github.com/dlgiovani/' target='_blank' className='btn btn-secondary flex items-center gap-2 md:justify-start'>
        <img src="/social-icons/github-round.webp" className='w-6 h-6 ease duration-300 rounded-full bg-accent' alt="github" />
        <span>Github</span>
      </a>
    </div>
  )
}

export default Buttons;