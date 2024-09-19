const Buttons = () => {

  return (
    <div className='w-fit flex lg:flex-col mt-6 lg:mt-0 justify-center lg:gap-4 text-sm md:text-base'>
      <a target='_blank' href='https://www.linkedin.com/messaging/compose?recipient=giovani-drosda-lima'
        className='btn btn-success md:justify-start'>Contrate-me</a>
      <a href="https://api.whatsapp.com/send?phone=5541984486463&text=Ol%C3%A1,%20Giovani!%0A%0AVi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar."
        target='_blank'
        className='btn btn-ghost lg:bg-primary/5 md:justify-start'>
        <span className="material-symbols-outlined">
          chat
        </span>
        whatsapp
      </a>
      <a href='https://github.com/dlgiovani/' target='_blank' className='btn btn-ghost lg:bg-primary/5 flex items-center gap-2 md:justify-start'>
        <img src="/social-icons/github-round.webp" className='w-6 h-6 ease duration-300 rounded-full' alt="github" />
        <span className='hidden md:block'>github</span>
      </a>
    </div>
  )
}

export default Buttons;