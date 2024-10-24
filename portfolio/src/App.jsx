import { useEffect, useMemo, useState } from 'react';
import Buttons from './components/Buttons.jsx';
import Header from './components/Header.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import Projects from './components/Projects.jsx';
import Ascii from './components/Ascii.jsx';
import Info from './components/Info.jsx';


function App() {

  const themes = useMemo(() => [
    "nord",
    "coffee",
    "night",
  ], [])

  const [currentTheme, setCurrentTheme] = useState(0);
  function handleChangeTheme(addend) {
    let nextTheme = (currentTheme + addend + themes.length) % (themes.length);
    setCurrentTheme(nextTheme);
  }
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [myProjects, setMyProjects] = useState([]);

  useEffect(() => {
    const data = Promise.resolve(fetch('/data/projects.json'));
    data.then(async (r) => setMyProjects(await r.json()))
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themes[currentTheme]);
  }, [currentTheme, themes])

  return (
    <>
      {isLoadingScreen && <LoadingScreen setIsLoadingScreen={setIsLoadingScreen} />}
      <main className={`w-full h-[85vh] bg-base-100 font-source-code-pro [&::selection]:color-success fadeInFromBlur`}>
        <Header handleChangeTheme={handleChangeTheme} />
        {/* <Langs /> */}
        <section name="title" className='w-full text-center text-base-content h-[95vh] relative'>
          <div className='flex flex-col justify-between items-center w-full sticky top-[5vh] md:top-[30vh] pb-4 gap-2'>
            <div className='flex flex-col lg:flex-row lg:gap-2 items-center titleFade lg:pl-12 bg-primary/45 rounded-box p-2'>
              <Ascii />
              <Info projectsCount={myProjects.length} theme={themes[currentTheme]} handleChangeTheme={handleChangeTheme} />
            </div>
            <div className='titleFade'>
              <Buttons />
            </div>
          </div>
        </section>
        <Projects myProjects={myProjects} />
        <div className={!isLoadingScreen ? `flex material-symbols-outlined absolute -bottom-[12svh] opacity-50 md:opacity-100 md:-bottom-6 left-0 hover:cursor-pointer
      w-full md:w-12 px-8 pt-1 md:mx-6 text-6xl justify-center md:bg-neutral/25 md:hover:bg-neutral/80 rounded-box pt-4` : ''}
          onClick={() => window.scrollBy({ top: 300, behavior: 'smooth' })}>
          <span className='animate-bounce'>
            keyboard_arrow_down
          </span>
        </div>
      </main>
    </>
  )
}

export default App;
