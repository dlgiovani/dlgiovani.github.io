const Info = ({projectsCount}) => {

  return (
    <section className="flex flex-col items-start">
      <p className="font-semibold">admin@pages</p>
      <p className="">-----------</p>
      <p className="flex gap-1">
        <span className="text-primary font-semibold">OS:</span>
        <span className="text-accent">GiOS Linux X86_64</span>
      </p>
      <p className="flex gap-1">
        <span className="text-primary font-semibold">Host:</span>
        <span className="text-accent">Browser VM LM40</span>
      </p>
      <p className="flex gap-1">
        <span className="text-primary font-semibold">Shell:</span>
        <span className="text-accent">smash 4.4.12</span>
      </p>
      <p className="flex gap-1">
        <span className="text-primary font-semibold">Theme:</span>
        <span className="text-accent">Coffee</span>
      </p>
      <p className="flex gap-1">
        <span className="text-primary font-semibold">Terminal Font:</span>
        <span className="text-accent">Source Code Pro</span>
      </p>
      <p className="flex gap-1">
        <span className="text-primary font-semibold">Projects:</span>
        <span className="text-accent">{projectsCount}</span>
      </p>
      <div className="mt-4 flex flex-col">
        <div className="flex self-center w-full">
          <div className="flex-grow bg-accent text-accent-content p-1 text-sm">python</div>
          <div className="flex-grow bg-secondary text-secondary-content p-1 text-sm">fastapi</div>
          <div className="flex-grow bg-neutral text-neutral-content p-1 text-sm">django</div>
          <div className="flex-grow bg-primary text-primary-content p-1 text-sm">typescript</div>
        </div>
        <div className="flex self-center w-full">
          <div className="flex-grow bg-secondary text-secondary-content p-1 text-sm">rest</div>
          <div className="flex-grow bg-primary text-primary-content p-1 text-sm">postgre/sql</div>
          <div className="flex-grow bg-accent text-accent-content p-1 text-sm">react</div>
          <div className="flex-grow bg-neutral text-neutral-content p-1 text-sm">apis</div>
        </div>
      </div>
    </section>
  )
}

export default Info;