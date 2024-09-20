const Theme = ({ handleChangeTheme }) => {

  return (
    <button className='!-rotate-90 flex items-center btn btn-ghost drop-shadow'
      onClick={() => handleChangeTheme(1)}>Tema
      <span className='material-symbols-outlined'>palette</span>
    </button>
  )
}

export default Theme;