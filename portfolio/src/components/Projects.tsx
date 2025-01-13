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
      <a key={index} target='_blank' href={item.link || null}
        onMouseEnter={item.coverUrl.endsWith('.webm') ? () => play(index) : () => { }}
        onMouseLeave={item.coverUrl.endsWith('.webm') ? () => pause(index) : () => { }}
      >
        <div
          className='aspect-video overflow-hidden mb-4 relative postsFade group'
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
            <p className='backdrop-blur bg-base-300/70 lg:hidden lg:group-hover:block p-2'>
              {item.description}
            </p>
          </div>
        </div>
      </a>
    );

  })

  return (
    <section id='projects' className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 pb-24'>
      {projectsList}
    </section>
  )
}

export default Projects;
