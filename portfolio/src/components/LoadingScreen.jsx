import { useEffect } from "react";
import "./LoadingScreen.css";

export default function LoadingScreen({ setIsLoadingScreen }) {

  useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoadingScreen(false);
      }, 3000);

    return () => {
      clearTimeout(timer);
    }
  }, [setIsLoadingScreen])
  
  return (
    <section className="w-full h-full absolute z-50 bg-[#9DAFA0] flex justify-center items-center fade-bg">
      <div className="fade-img relative">
        <img src="/cat_running.webp" className="rounded-[100%]" />
      </div>
    </section>
  )
}