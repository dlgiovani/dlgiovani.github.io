import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";

export default function LoadingScreen({ setIsLoadingScreen }) {

  const [visibleScript, setVisibleScript] = useState([]);

  const script = [
    " GiOS v2.2.3 booting...",
    " -These messages are cosmetic only, I am not hacking you.",
    " -Initializing kernel... [OK]",
    " -React dev environment... starting... [OK]",
    " --Loading information... [OK]",
    " --Loading languages... [OK]",
    " --Loading soundtrack... [OK]",
    " --Fetching weather... [OK]",
    " --Fetching projects... [OK]",
    " --Fetching themes... [OK]",
    " System ready."
  ];

  const typingScript = script.map((item, index) => <li className="list-['$'] px-2" key={index} >{item}</li>)

  useEffect(() => {
    function addScript() {
      if (visibleScript.length === script.length) {
        setVisibleScript((old) => [...old, 
          <TypeAnimation key={'last'} 
          sequence={["Launching User Interface"]} 
          speed={40} />
        ]);
        setTimeout(
          () => setIsLoadingScreen(false), 1800
        )
        return;
      }
      setVisibleScript((old) => [...old, typingScript[old.length]]);
    }
    setTimeout(() => addScript(), Math.random()*120);
  }, [visibleScript.length])
  return (
    <div className="flex flex-col h-svh w-svw pb-12 justify-end text-xs md:text-base absolute z-[999] overflow-hidden bg-base-100">
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