import React from "react";
import { useState, ReactNode } from "react";
import { texts, LanguageCode } from "../texts.ts";
import { LanguageContext } from "./LanguageContext.ts";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {

    const userLanguage = JSON.parse(localStorage.getItem("userLanguage") || '{}');
    const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(
        userLanguage.language ? userLanguage.language : "ptbr");
    const saveCurrentLanguage = (language: LanguageCode) => {
        setCurrentLanguage(language);
        localStorage.setItem("userLanguage", JSON.stringify({language: currentLanguage}));
    };
    const translate = (key: keyof typeof texts) => texts[key][currentLanguage];

    return (
        <LanguageContext.Provider value={{ currentLanguage, saveCurrentLanguage, translate }}>
            { children }
        </LanguageContext.Provider>
    )
}