import { useEffect, useRef, useState } from 'react';
import { drawNoise, callSetTimeout } from "./effects/noise.js";
import projects from './data/projects.js';

function App() {

  const myProjects = projects();
  const canvasRef = useRef(null);
  const [showcase, setShowcase] = useState(null);
  const [showcasePosition, setShowcasePosition] = useState([0, 0]);
  const [showcaseSize, setShowcaseSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      drawNoise(ctx, canvas);
      callSetTimeout(canvas);
    }
  }, []);

  function handleShowcase(url) {
    if (url === '' || window.innerWidth < 1024) {
      setShowcase(null);
      return;
    }

    if (url.endsWith('.webm')) {
      setShowcase(<video src={url} className='max-w-[500px] absolute rounded-lg animate-showUp' autoPlay muted
        style={{
          left: window.innerWidth / 3 + showcasePosition[0] / 4,
          top: Math.max(50, showcasePosition[1] - 120),
        }}></video>)
    } else {
      setShowcase(<img src={url} className='max-w-[40vw] max-h-[70vh] absolute rounded-lg animate-showUp'
        onLoad={(e) => { const { width, height } = e.target; setShowcaseSize({ width, height }) }}
        style={{
          left: window.innerWidth / 3 + showcasePosition[0] / 4,
          top: Math.min(window.innerHeight - showcaseSize.height - 10, Math.max(50, showcasePosition[1] - 120)),
        }}></img>)
    }

  }

  const projectsList = myProjects.map((item, index) => {
    return <a key={index} target='_blank' href={item.link}
      onMouseEnter={(e) => { setShowcasePosition([e.clientX, e.clientY]); handleShowcase(item.coverUrl) }}
      onMouseMove={(e) => { setShowcasePosition([e.clientX, e.clientY]); handleShowcase(item.coverUrl) }}
      onMouseLeave={() => handleShowcase('')}>
      <li className={`flex justify-between gap-6 p-3 ${item.link !== '' ? 'project-button' : 'opacity-70'}`}>
        <span className=''>{item.name}</span>
        <span className='text-neutral-400'>{item.year}</span>
      </li>
    </a>
  })

  return (
    <div className='w-screen bg-breathing overflow-x-hidden'>
      <canvas ref={canvasRef} id="noise" className='noise'></canvas>
      <section className='flex flex-col lg:flex-row-reverse h-screen w-screen'>
        <div className='h-full flex flex-grow p-4 justify-center lg:justify-start'>
          <div className='lg:fixed lg:top-[35vh]'>
            <div className='h-[30vh] flex flex-col justify-center'>

              <h1 className='text-xl font-semibold'>Giovani <span className='text-neutral-700'>Drosda</span> <span className='text-neutral-500'>Lima</span></h1>
              <h2 className='text-xl font-semibold'>Software Developer | Programmer</h2>
              <h3 className='text-xs text-neutral-700'>websites · APIs · webapps · SaaS · analytics · dashboards · crm/erp</h3>
              <ul className='w-fit flex gap-3 mt-2'>
                <a target="_blank" href='https://github.com/dlgiovani/' className='hover:text-neutral-600 hover:underline underline-offset-4 ease duration-100'>
                  <li className='opacity-80 text-lg'>GitHub</li>
                </a>
                <a target="mailto:gdrosdalima@gmail.com" href='mailto:gdrosdalima@gmail.com' className='hover:text-neutral-600 hover:underline underline-offset-4 ease duration-100'>
                  <li className='opacity-80 text-lg'>Email</li>
                </a>
                <a target="_blank" href='https://medium.com/@gdrosdalima' className='hover:text-neutral-600 hover:underline underline-offset-4 ease duration-100'>
                  <li className='opacity-80 text-lg'>Medium</li>
                </a>
                <a target="_blank" href='https://www.linkedin.com/in/giovani-drosda-lima/' className='hover:text-neutral-600 hover:underline underline-offset-4 ease duration-100'>
                  <li className='opacity-80 text-lg'>LinkedIn</li>
                </a>
              </ul>
            </div>
          </div>
        </div>
        <div className='h-fit lg:w-[40vw] flex justify-center'>
          <ul className='lg:w-[30vw] max-w-fit h-fit pt-[27vh] pb-[27vh] flex flex-col gap-3'>
            {projectsList}
          </ul>
        </div>
      </section>
      <section className='fixed bottom-2 w-full lg:w-fit text-center lg:right-6'>
        <p className='text-xs text-neutral-600 font-thin'>Giovani Drosda Lima, 2024 | Inspired by <a className='underline' href='https://www.seyityilmaz.com/'>Seyit Yilmaz</a></p>
      </section>
      {showcase}
    </div>
  )
}

export default App;
