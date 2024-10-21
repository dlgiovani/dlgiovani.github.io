const Theme = ({ handleChangeTheme }) => {

  return (
    <button className='hidden md:flex items-center btn btn-ghost drop-shadow text-sm md:text-base'
      onClick={() => handleChangeTheme(1)}>Tema
      <span className='material-symbols-outlined text-sm md:text-lg'>palette</span>
    </button>
  )
}

export default Theme;