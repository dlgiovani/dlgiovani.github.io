import React, { useEffect } from "react";
import "./LoadingScreen.css";

export default function LoadingScreen({ setIsLoadingScreen }) {

  useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoadingScreen(false);
      }, 1800);

    return () => {
      clearTimeout(timer);
    }
  }, [setIsLoadingScreen])
  
  return (
    <section className="w-full h-full absolute z-50 bg-black flex justify-center items-center fade-bg">
      <img src="/cat-loading.webp" alt="loading screen cat" />
    </section>
  )
}