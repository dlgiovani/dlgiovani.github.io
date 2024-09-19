import { useRef, useState } from "react";

const Song = () => {

  const [songSpan, setSongSpan] = useState('play_arrow');
  const songRef = useRef(null);


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
      <button className='fixed top-24 md:bottom-28 md:top-[auto] -right-4 md:right-0 !-rotate-90 flex items-center btn btn-ghost drop-shadow'
        onClick={handleSongClick}>Música
        <span className='material-symbols-outlined'>{songSpan}</span>
      </button>
      <audio ref={songRef} src='/songs/C418 - Aria Math (Minecraft Volume Beta).mp3' />
    </>
  )
}

export default Song;