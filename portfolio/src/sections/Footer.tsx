const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <section className="bg-base-300">
            <hr />
            <div className="w-full flex flex-col md:flex-row justify-between md:items-center px-4 py-2 font-thin text-sm font-urbanist">
                <p>
                    Desenvolvido com 🧠 por Giovani
                </p>
                <p>
                    © {currentYear} - Todos os direitos reservados
                </p>
                <p>
                    CNPJ: 58.093.795/0001
                </p>
            </div>
        </section>
    );
};

export default Footer;