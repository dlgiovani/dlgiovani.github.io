import { useContext, createContext } from "react";
import { texts, LanguageCode } from "../texts.ts";


interface LanguageContextProps {
  currentLanguage: LanguageCode;
  // setCurrentLanguage: (language: LanguageCode) => void;
  saveCurrentLanguage: (language: LanguageCode) => void;
  translate: (key: keyof typeof texts) => string;
}

export const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
