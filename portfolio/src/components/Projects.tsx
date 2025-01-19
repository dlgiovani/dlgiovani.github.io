import React, { useRef } from 'react';

const Projects = ({ myProjects }) => {
  const playManager = useRef<[HTMLVideoElement] | []>([]);
  const play = (index: number) => {
    playManager.current[index].play();
  };
  const pause = (index: number) => {
    playManager.current[index].pause();
  };

  const projectsList = myProjects?.map((item: any, index: number) => {
    return (
      <div key={index} className='flex md:even:flex-row-reverse md:flex-row flex-col gap-2 w-full bg-base-200 odd:bg-base-300 rounded-box p-1'>
        <a target='_blank' href={item.link || null} className='md:w-[50%] h-fit'
          onMouseEnter={item.coverUrl.endsWith('.webm') ? () => play(index) : () => { }}
          onMouseLeave={item.coverUrl.endsWith('.webm') ? () => pause(index) : () => { }}
        >
          <div
            className='aspect-video overflow-hidden relative postsFade group rounded-box'
            style={{ backgroundImage: `url('${item.coverUrl || "/misterybox.webp"}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            {item.coverUrl.endsWith('.webm') && (
              <video src={item.coverUrl} ref={(element) => playManager.current[index] = element as HTMLVideoElement}
                muted loop className='absolute inset-0 z-10'></video>
            )}
            <div className='w-full h-full lg:bg-black/50 hover:bg-black/0 ease duration-300 z-20 flex flex-col justify-between absolute inset-0'>
              <div className='w-full h-fit p-2 group-hover:bg-primary bg-accent flex justify-between self-start ease duration-200'>
                <p className='group-hover:text-primary-content text-accent-content'>{item.name}</p>
                <p className='group-hover:text-primary-content text-accent-content'>{item.year}</p>
              </div>
            </div>
          </div>
        </a>
        <div className='md:w-[35%] flex items-center justify-center'>
          <p className='p-2 md:max-w-[50%]'>
            {item.description}
          </p>
        </div>
      </div>
    );

  })

  return (
    <section id='projects' className='flex flex-col gap-2 pb-24 px-4 md:px-12 lg:px-16'>
      {projectsList}
    </section>
  )
}

export default Projects;
