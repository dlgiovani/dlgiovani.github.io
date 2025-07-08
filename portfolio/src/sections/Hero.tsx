import { useRef } from 'react';
import VariableProximity from '../TextAnimations/VariableProximity/VariableProximity';
import { FiFileText, FiInfo, FiMessageCircle } from 'react-icons/fi';
import GlassIconsMagnet from '../Components/GlassIcons/GlassIconsMagnet';
import Folder from '../Components/Folder/Folder';
import SplitText from '../TextAnimations/SplitText/SplitText';

// TODO: Dock no mobile?

const Hero = () => {

    const containerRef = useRef(null);

    const items = [
        { icon: <FiFileText />, color: 'var(--color-primary)', label: 'Soluções', customClass: "cursor-pointer text-primary-content hover:text-base-content duration-300 ease", url: "#solucoes" },
        { icon: <FiInfo />, color: 'var(--color-secondary)', label: 'Sobre', customClass: "cursor-pointer text-secondary-content hover:text-base-content duration-300 ease", url: "#sobre" },
        { icon: <FiMessageCircle />, color: 'var(--color-accent)', label: 'Contato', customClass: "cursor-pointer text-accent-content hover:text-base-content duration-300 ease", url: "#contato" },
    ];

    return (
        <div className="w-screen h-[92.36dvh] flex flex-col justify-center px-4 md:px-12">
            <div className='grid grid-cols-2 items-center'>
                <div
                    ref={containerRef}
                    className='relative'
                >
                    <VariableProximity
                        label={'Software, bem feito.'}
                        className={'text-2xl md:text-5xl !hidden md:!inline'}
                        fromFontVariationSettings="'wght' 400, 'opsz' 9"
                        toFontVariationSettings="'wght' 1000, 'opsz' 40"
                        containerRef={containerRef}
                        radius={100}
                        falloff='linear'
                    />
                    <h1 className={'text-2xl md:text-5xl hidden'}>
                        Software, bem feito.
                    </h1>
                    <SplitText
                        text="Software, bem feito"
                        className="text-2xl md:text-5xl inline md:hidden"
                        delay={100}
                        duration={0.6}
                        ease="power3.out"
                        splitType="words"
                        from={{ opacity: 0, y: 40 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                        rootMargin="-100px"
                        textAlign="left"
                    />
                </div>

                <div className='relative w-full hidden md:block'>
                    <GlassIconsMagnet items={items} className="" />
                </div>

                <div className='relative w-full h-full block md:hidden'>
                    <Folder size={.5} color="var(--color-primary)" className="custom-folder"
                        items={
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            items.map((i: any, ix: number) => <GlassIconsMagnet items={[i]} className="" key={ix} />)
                        } />
                </div>

            </div>
        </div>
    );
};

export default Hero;