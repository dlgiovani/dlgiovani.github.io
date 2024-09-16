import { useEffect, useState } from 'react';
// import projects from './data/projects.js';
import { TypeAnimation } from 'react-type-animation';
import Langs from './components/Langs.jsx';

function App() {

  const [myProjects, setMyProjects] = useState([]);
  useEffect(() => {
    const data = Promise.resolve(fetch('https://dlgiovani.github.io/data/projects.js'));
    data.then((r) => setMyProjects(r.json()))
  }, [])

  const projectsList = myProjects.map((item, index) => {
    return (
      <a key={index} target='_blank' href={item.link || null}>
        <div
          className='aspect-video overflow-hidden mb-4 relative postsFade'
          style={{ backgroundImage: `url('${item.coverUrl || '/misterybox.webp'}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {item.coverUrl.endsWith('.webm') && (
            <video src={item.coverUrl} autoPlay muted loop className='absolute inset-0 z-10'></video>
          )}
          <div className='w-full h-full lg:bg-black/50 hover:bg-black/0 ease duration-300 z-20 flex items-end justify-between absolute inset-0'>
            <div className='w-full h-fit p-2 bg-primary flex justify-between self-start'>
              <p className=''>{item.name}</p>
              <p className=''>{item.year}</p>
            </div>
          </div>
        </div>
      </a>
    );

  })


  return (
    <main className='w-full h-[85vh] bg-base-100 font-source-code-pro [&::selection]:color-success '>
      <Langs />
      <section name="title" className='w-full text-center text-base-content h-[95vh]'>
        <div className='flex flex-col justify-center items-center w-full sticky top-[30vh] pb-4 gap-2'>
          <h1 className='titleFade font-[Montserrat] text-5xl lg:text-8xl flex items-end gap-2'>
            <span>Giovani</span>
            <a href='https://github.com/dlgiovani/' target='_blank'>
              <img src="/social-icons/github.webp" className='lg:w-12 lg:h-12 w-8 h-8 bg-accent hover:bg-success ease duration-300 rounded-xl' alt="github" />
            </a>
          </h1>
          <p className="titleFade bg-gradient-to-br from-stone-400 via-white to-stone-500 bg-clip-text text-transparent w-fit">
            <TypeAnimation
              sequence={['software developer', 'desenvolvedor de software']}
              speed={180} deletionSpeed={150} /><span className='caret text-white'>|</span>
          </p>
          <div className='flex gap-4'>
            <a target='_blank' href='https://www.linkedin.com/messaging/compose?recipient=giovani-drosda-lima'
              className='btn btn-success mb-4'>Contrate-me</a>
            <a href="https://api.whatsapp.com/send?phone=5541984486463&text=Ol%C3%A1,%20Giovani!%0A%0AVi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar."
              className='btn btn-success btn-ghost'>
              <span className="material-symbols-outlined">
                chat
              </span>
              whatsapp
            </a>
          </div>
        </div>
      </section>
      <section name="projects" className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 pb-24'>
        {projectsList}
      </section>
    </main>
  )
}

export default App;
