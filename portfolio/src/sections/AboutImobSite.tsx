const AboutImobSite = () => {

    const topicos = [
        {
            title: "100% Integrado ao seu CRM/ERP",
            text: "O site recebe dados diretamente do seu sistema, além de conseguir enviar leads, métricas, e outras informações totalmente customizáveis."
        },
        {
            title: "Atualizações Instantâneas",
            text: "O site conta com um sistema de atualizações de dados inteligente. Nunca mais ouça reclamações sobre informações desatualizadas."
        },
        {
            title: "Disponibilidade até quando o sistema cai",
            text: "Seu CRM está fora do ar? Sem problemas, o site continua funcionando com as últimas informações disponíveis, com todos os dados e funcionalidades."
        },
        {
            title: "Velocidade Extrema",
            text: "A política inteligente de cache juntamente com o banco de dados local otimizado no servidor oferecem um tempo de resposta praticamente instantâneo. Ter que esperar os filtros buscarem os resultados é coisa do passado."
        },
        {
            title: "SEO eficaz e com suporte à LLMs",
            text: "Você sabia que, em 2025, ~50% das pessoas preferem pesquisar em IAs do que no Google? Além de seguirmos as melhores práticas para um bom resultado de SEO em ferramentas de pesquisa convencionais, também integramos um serviço dedicado ao SEO para IAs (ChatGPT, DeepSeek, Claude, Grok, Gemini...), acompanhando o comportamento do usuário contemporâneo."
        },
        {
            title: "Dashboard com informações do Site e de Sistemas Terceirizados",
            text: "Sua empresa utiliza portais terceirizados para vender? Traga as métricas deles diretamente para seu site, com suporte tanto à área do vendedor quanto a do cliente."
        },
        {
            title: "Suporte Dedicado",
            text: "Precisa de uma atualização específica no site? Não precisa abrir chamado. Fale diretamente com o desenvolvedor, sem burocracia."
        },
        {
            title: "Informações Técnicas",
            text: "Baixe aqui as especificações técnicas do site.",
            link: "/Documentação Técnica - Site Imobiliário - dlgiovani.github.io.pdf"
        },
    ]

    return (
        <>
            <div className="join join-vertical bg-base-100 rounded-box">
                {topicos.map((topic, index) =>
                    <div className="collapse collapse-arrow join-item border-base-300 border" key={index}>
                        <input type="radio" name="my-accordion-4" />
                        <div className="collapse-title font-semibold text-lg md:text-xl">{topic.title}</div>
                        {topic?.link ?
                            <a href={topic.link} target="_blank" className="text-pretty text-md md:text-lg collapse-content link link-primary">{topic.text}</a>
                            :
                            <div className="text-pretty text-md md:text-lg collapse-content">{topic.text}</div>
                        }
                    </div>
                )}
            </div >
        </>
    );
};

export default AboutImobSite;