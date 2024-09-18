import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";

export default function LoadingScreen({ setIsLoadingScreen }) {

  const [visibleScript, setVisibleScript] = useState([]);

  const script = [
    "GiOS v2.2.3 booting...",
    "Initializing kernel... [OK]",
    "Mounting file system: /home/projects/portfolio [OK]",
    "Detecting hardware: CPU... [OK], Memory... [OK], Creativity Level... [Over 9000]",
    "Loading module: Phosphor Icons API [OK]",
    "Starting network services... IPv4: Configuring... [OK] | IPv6: Sooner or later, friend.",
    "Running startup scripts...",
    "Python environment loaded.",
    "Connecting to PostgreSQL server... [OK]",
    "Checking for FastAPI routes... /projects... [OK] /books... [OK] /oauth2... [OK]",
    "React dev environment... starting... [OK]",
    "Cache Axios responses... ready to boost app performance... [OK]",
    "Setting sticky elements... stickiness level: high [OK]",
    "Compiling Next.js components... [Error: index.tsx not found] — just kidding. [OK]",
    "OAuth2 authentication initialized... User securely logged in.",
    "Loading information... [OK]",
    "Loading languages... [OK]",
    "Loading soundtrack... [OK]",
    "Fetching weather... [OK]",
    "Fetching projects... [OK]",
    "System ready."
  ];

  const typingScript = script.map((item, index) => <li className="list-['$']" key={index} >{item}</li>)

  useEffect(() => {
    function addScript() {
      if (visibleScript.length === script.length) {
        setVisibleScript((old) => [...old, 
          <TypeAnimation key={'last'} 
          sequence={["Launching User Interface ==============================================================================="]} 
          speed={40} />
        ]);
        setTimeout(
          () => setIsLoadingScreen(false), 2500
        )
        return;
      }
      setVisibleScript((old) => [...old, typingScript[old.length]]);
    }
    setTimeout(() => addScript(), Math.random()*180);
  }, [visibleScript.length])
  return (
    <div className="flex flex-col h-svh pb-1 justify-end text-xs md:text-base">
      {
        visibleScript.map(
          (item, index) =>
            <div key={index} className="flex gap-1 relative font-mono text-success">
              {item}
              {index === visibleScript.length - 1 && <span className='caret'>|</span>}
            </div>
        )
      }
    </div>
  )
}