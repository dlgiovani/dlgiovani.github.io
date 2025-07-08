import Magnet from './Animations/Magnet/Magnet';
import './App.css'
import SpotlightCard from './Components/SpotlightCard/SpotlightCard';
import AboutImobSite from './sections/AboutImobSite';
import Footer from './sections/Footer';
import Hero from './sections/Hero';
import Navbar from './sections/Navbar';
import RotatingText from './TextAnimations/RotatingText/RotatingText';
import ScrollReveal from './TextAnimations/ScrollReveal/ScrollReveal';
import ShinyText from './TextAnimations/ShinyText/ShinyText';

function App() {

  const howLongHaveIBeenAProgrammerWhoFindsItHardToNameVariables = Number(new Date().getFullYear()) - 2017;
  const aboutMeText = `Meu nome é Giovani, e eu sou programador há ${howLongHaveIBeenAProgrammerWhoFindsItHardToNameVariables} anos.
  Especializei-me em webapps e websites pois vi o potencial dessas ferramentas web: rodam em qualquer lugar, você só precisa de acesso à Internet.
  Gosto de fazer integrações, dashboards e soluções que ajudam a alavancar o seu negócio, ou uma área do seu negócio.`

  return (
    <>
      <main className='flex flex-col items-center w-full font-urbanist overflow-y-auto [scrollbar-gutter:stable] bg-base-100'>
        <Navbar />
        <Hero />

        <span id='solucoes' className='-translate-y-16'></span>
        <section className='w-screen bg-base-300 p-4 md:p-12 flex flex-col items-center gap-12'>
          <h2 className='text-2xl md:text-3xl font-semibold text-center group'>
            Faça seu site com quem se <span className='group-hover:decoration-primary underline decoration-transparent duration-300 ease'>especializa</span> no assunto.
          </h2>
          <Magnet padding={50} disabled={false} magnetStrength={10}>
            <a href="http://134.65.50.228:3000/" target='_blank'>
              <button className='btn btn-primary p-6 text-md md:text-xl'>
                <ShinyText text="✨ Veja o que sua empresa pode ter!" disabled={false} speed={3} className='text-primary-content/80' />
              </button>
            </a>
          </Magnet>
          <AboutImobSite />
        </section>

        <span id='sobre' className='-translate-y-16'></span>
        <section className='w-screen bg-base-200 p-4 md:p-12 flex flex-col gap-12'>
          <h2 className='group text-2xl md:text-3xl font-semibold text-center'>
            O que eu faço<span className='group-hover:opacity-0 group-hover:text-sm duration-300 ease'>?</span><span className='text-sm opacity-0 group-hover:text-2xl md:group-hover:text-3xl group-hover:opacity-100 duration-300 ease text-secondary'>!</span>
          </h2>

          <div className='md:px-24'>
            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={4}
              blurStrength={10}
              textClassName='!text-lg md:!text-2xl !font-normal text-pretty'
            >
              Eu ofereço soluções de ponta customizadas que integram as tecnologias mais eficientes do mercado,
              de acordo com suas necessidades e objetivos.
            </ScrollReveal>
          </div>

          <div className='md:px-24'>
            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={4}
              blurStrength={10}
              textClassName='!text-lg md:!text-2xl !font-normal text-pretty'
            >
              Essas soluções se encontram na forma de websites, catálogos, integrações e dashboards,
              melhorando a sua vida e a de seus clientes.
            </ScrollReveal>
          </div>

          <h2 className='group text-2xl md:text-3xl font-semibold text-center'>
            Quem sou eu<span className='group-hover:opacity-0 group-hover:text-sm duration-300 ease'>?</span><span className='text-sm opacity-0 group-hover:text-2xl md:group-hover:text-3xl group-hover:opacity-100 duration-300 ease text-secondary'>!</span>
          </h2>

          <div className='md:px-24'>
            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={4}
              blurStrength={10}
              textClassName='!text-lg md:!text-2xl !font-normal text-pretty'
            >
              {aboutMeText}
            </ScrollReveal>
          </div>
        </section>

        <span id='contato' className='-translate-y-16'></span>
        <section className='w-screen bg-base-300'>
          <div className='p-4 md:p-12 text-2xl md:text-3xl text-center w-full flex flex-col gap-12'>
            <div className='flex gap-2 items-center w-full justify-center'>
              <span>
                Meu
              </span>
              <span>
                <RotatingText
                  texts={['WhatsApp', 'E-mail', 'GitHub', 'LinkedIn', 'WhatsApp', 'Correio Eletrônico', 'GitHub', 'LinkedIn',]}
                  mainClassName="px-2 sm:px-2 md:px-3 bg-accent text-accent-content overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                  staggerFrom={"last"}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={3600}
                />
              </span>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              <SpotlightCard
                className="hover:scale-105 transition-transform duration-300 cursor-pointer !bg-base-200"
                spotlightColor="rgba(37, 211, 102, 0.2)"
              >
                <div className="flex flex-col items-center text-center p-4" onClick={() => window.open('https://api.whatsapp.com/send/?phone=5541984486463&text&type=phone_number&text=Ol%C3%A1,%20Giovani.%20Vi%20seu%20portif%C3%B3lio%20e%20gostaria%20de%20conversar.&utm_source=dlgiovani.github.io', '_blank')}>
                  <div className="text-3xl mb-2">📱</div>
                  <h3 className="font-bold text-lg mb-1">WhatsApp</h3>
                  <p className="text-sm opacity-70 mb-3">Resposta rápida</p>
                  <button className="btn btn-secondary btn-sm">Conversar</button>
                </div>
              </SpotlightCard>

              <SpotlightCard
                className="hover:scale-105 transition-transform duration-300 cursor-pointer !bg-base-200"
                spotlightColor="rgba(234, 67, 53, 0.2)"
              >
                <div className="flex flex-col items-center text-center p-4" onClick={() => window.open('mailto:contatogiovanidl@gmail.com?utm_source=dlgiovani.github.io', '_blank')}>
                  <div className="text-3xl mb-2">✉️</div>
                  <h3 className="font-bold text-lg mb-1">E-mail</h3>
                  <p className="text-sm opacity-70 mb-3">Contato formal</p>
                  <button className="btn btn-secondary btn-sm">Enviar</button>
                </div>
              </SpotlightCard>

              <SpotlightCard
                className="hover:scale-105 transition-transform duration-300 cursor-pointer !bg-base-200"
                spotlightColor="rgba(76, 41, 86, 0.2)"
              >
                <div className="flex flex-col items-center text-center p-4" onClick={() => window.open('https://github.com/dlgiovani?utm_source=dlgiovani.github.io', '_blank')}>
                  <div className="text-3xl mb-2">🐙</div>
                  <h3 className="font-bold text-lg mb-1">GitHub</h3>
                  <p className="text-sm opacity-70 mb-3">Veja meus projetos</p>
                  <button className="btn btn-secondary btn-sm">Acessar</button>
                </div>
              </SpotlightCard>

              <SpotlightCard
                className="hover:scale-105 transition-transform duration-300 cursor-pointer !bg-base-200"
                spotlightColor="rgba(10, 102, 194, 0.2)"
              >
                <div className="flex flex-col items-center text-center p-4" onClick={() => window.open('https://www.linkedin.com/in/giovani-drosda-lima/?utm_source=dlgiovani.github.io', '_blank')}>
                  <div className="text-3xl mb-2">💼</div>
                  <h3 className="font-bold text-lg mb-1">LinkedIn</h3>
                  <p className="text-sm opacity-70 mb-3">Conecte-se</p>
                  <button className="btn btn-secondary btn-sm">Conectar</button>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default App;