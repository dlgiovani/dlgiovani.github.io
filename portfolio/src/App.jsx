import { useEffect, useState } from 'react';
import Buttons from './components/Buttons.jsx';
import Header from './components/Header.jsx';
import Langs from './components/Langs.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import Projects from './components/Projects.jsx';
import Song from './components/Song.jsx';
import Ascii from './components/Ascii.jsx';
import Info from './components/Info.jsx';

function App() {

  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [myProjects, setMyProjects] = useState([]);

  useEffect(() => {
    const data = Promise.resolve(fetch('/data/projects.json'));
    data.then(async (r) => setMyProjects(await r.json()))
  }, [])

  if (isLoadingScreen) return <LoadingScreen setIsLoadingScreen={setIsLoadingScreen} />
  document.documentElement.setAttribute('data-theme', 'coffee');

  return (
    <main className='w-full h-[85vh] bg-base-100 font-source-code-pro [&::selection]:color-success fadeInFromBlur'>
      <Header />
      {/* <Langs /> */}
      <section name="title" className='w-full text-center text-base-content h-[95vh] relative'>
        <div className='flex flex-col lg:flex-row justify-around items-center w-full lg:w-[75%] sticky top-[5vh] md:top-[30vh] pb-4 gap-2 titleFade'>
          <div className='flex flex-col lg:flex-row md:gap-2 items-center'>
            <Ascii />
            <Info projectsCount={myProjects.length} />
          </div>
          <Buttons />
        </div>
      </section>
      <Projects myProjects={myProjects} />
      <Song />
      <div className='hidden md:flex material-symbols-outlined absolute -bottom-6 right-0 hover:cursor-pointer
      w-full md:w-12 px-8 pt-1 mx-6 text-6xl justify-center bg-neutral/25 hover:bg-neutral/80 rounded-full animate-bounce'
        onClick={() => window.scrollBy({ top: 300, behavior: 'smooth' })}>keyboard_arrow_down</div>
    </main>
  )
}

export default App;
