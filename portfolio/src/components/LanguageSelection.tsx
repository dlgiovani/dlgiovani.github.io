import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const LanguageSelection = () => {

    const language = useLanguage();

    return (
        <div className="flex gap-1 items-center btn btn-ghost"
        onClick={() => language.saveCurrentLanguage(language.currentLanguage === "en" ? "ptbr" : "en")}>
            <picture className={language.currentLanguage !== "ptbr" ? "grayscale" : ""}>
                <source
                    type="image/webp"
                    srcSet="/br.webp,
                https://flagcdn.com/16x12/br.webp,
                https://flagcdn.com/32x24/br.webp 2x,
                https://flagcdn.com/48x36/br.webp 3x" />
                <source
                    type="image/png"
                    srcSet="https://flagcdn.com/16x12/br.png,
                https://flagcdn.com/32x24/br.png 2x,
                https://flagcdn.com/48x36/br.png 3x" />
                <img
                    src="https://flagcdn.com/16x12/br.png"
                    width="16"
                    height="12"
                    alt="Brazil" />
            </picture>
            <span>/</span>
            <picture className={language.currentLanguage !== "en" ? "grayscale" : ""}>
                <source
                    type="image/webp"
                    srcSet="/un.webp,
                https://flagcdn.com/16x12/un.webp,
                https://flagcdn.com/32x24/un.webp 2x,
                https://flagcdn.com/48x36/un.webp 3x" />
                <source
                    type="image/png"
                    srcSet="https://flagcdn.com/16x12/un.png,
                https://flagcdn.com/32x24/un.png 2x,
                https://flagcdn.com/48x36/un.png 3x" />
                <img
                    src="https://flagcdn.com/16x12/un.png"
                    width="16"
                    height="12"
                    alt="World" />
            </picture>
        </div>
    );
};

export default LanguageSelection;