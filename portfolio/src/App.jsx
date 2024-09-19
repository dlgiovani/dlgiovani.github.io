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
      <section name="title" className='w-full text-center text-base-content h-[95vh]'>
        <div className='flex flex-col justify-center items-center w-full sticky top-[15vh] md:top-[30vh] pb-4 gap-2'>
          <div className='flex gap-2 flex-col items-center md:flex-row'>
            <Ascii />
            <Info projectsCount={myProjects.length} />
          </div>
          <Buttons />
        </div>
      </section>
      <Projects myProjects={myProjects}/>
      <Song />
    </main>
  )
}

export default App;
