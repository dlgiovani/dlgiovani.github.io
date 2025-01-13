import { useEffect, useMemo, useState, lazy, Suspense } from 'react';
import Buttons from './components/Buttons.jsx';
import Header from './components/Header.tsx';
import Cat from './components/Cat.jsx';
import Info from './components/Info.tsx';

const Projects = lazy(() => import('./components/Projects.tsx'));

function App() {
  const themes = useMemo(() => [
    'luxury',
    'sunset',
    'lily',
    'fantasy',
    'retro',
    'nord',
  ], []);

  const [currentTheme, setCurrentTheme] = useState(0);
  const [myProjects, setMyProjects] = useState([]);

  function handleChangeTheme(addend) {
    let nextTheme = (currentTheme + addend + themes.length) % themes.length;
    setCurrentTheme(nextTheme);
  }

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/data/projects.json');
        const data = await response.json();
        setMyProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }

    if ('requestIdleCallback' in window) {
      requestIdleCallback(fetchProjects);
    } else {
      setTimeout(fetchProjects, 0);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themes[currentTheme]);
  }, [currentTheme, themes]);

  return (
    <>
      <main className={`w-full bg-base-100 font-source-code-pro [&::selection]:color-accent fadeInFromBlur`}>
        <Header handleChangeTheme={handleChangeTheme} />
        <section name="title" className="w-full text-center text-base-content h-[98vh] relative">
          <div className="flex flex-col justify-between items-center w-full h-fit sticky top-[8vh] md:top-[12vh] pb-4 gap-2">
            <div className="flex flex-col lg:flex-row lg:gap-2 items-center titleFade lg:px-12 bg-primary/65 rounded-box p-2">
              <Cat />
              <Info
                projectsCount={myProjects.length}
                theme={themes[currentTheme]}
                handleChangeTheme={handleChangeTheme}
              />
            </div>
            <div className="titleFade">
              <Buttons />
            </div>
          </div>
        </section>
        <Suspense fallback={
          <div className='flex w-full justify-evenly'>
            <div className="flex w-52 flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                <div className="flex flex-col gap-4">
                  <div className="skeleton h-4 w-20"></div>
                  <div className="skeleton h-4 w-28"></div>
                </div>
              </div>
              <div className="skeleton h-32 w-full"></div>
            </div>
            <div className="flex w-52 flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                <div className="flex flex-col gap-4">
                  <div className="skeleton h-4 w-20"></div>
                  <div className="skeleton h-4 w-28"></div>
                </div>
              </div>
              <div className="skeleton h-32 w-full"></div>
            </div>
          </div>
        }>
          <Projects myProjects={myProjects} />
        </Suspense>
      </main>
    </>
  );
}

export default App;
