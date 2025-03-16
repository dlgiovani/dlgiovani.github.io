import React, { useRef, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const Song = () => {

  const language = useLanguage();

  const [songSpan, setSongSpan] = useState('play_arrow');
  const songRef = useRef<HTMLMediaElement>(null);


  const handleSongClick = () => {
    if (songRef.current) {
      // Toggle play/pause
      if (songRef.current.paused) {
        songRef.current.play();
        setSongSpan('pause');
      } else {
        songRef.current.pause();
        setSongSpan('play_arrow');
      }
    }
  };

  return (
    <>
      <button className='capitalize hidden md:flex items-center btn btn-ghost drop-shadow text-sm md:text-base'
        onClick={handleSongClick}>{language.translate("song")}
        <span className='material-symbols-outlined text-sm md:text-lg'>{songSpan}</span>
      </button>
      <audio ref={songRef} src='/songs/C418 - Aria Math (Minecraft Volume Beta).mp3' />
    </>
  )
}

export default Song;