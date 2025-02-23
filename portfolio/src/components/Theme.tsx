import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const Theme = ({ handleChangeTheme }) => {

  const language = useLanguage();

  return (
    <button name={language.translate("theme")} className='capitalize hidden md:flex items-center btn btn-ghost drop-shadow text-sm md:text-base'
      onClick={() => handleChangeTheme(1)}>{language.translate('theme')}
      <span className='material-symbols-outlined text-sm md:text-lg'>palette</span>
    </button>
  )
}

export default Theme;