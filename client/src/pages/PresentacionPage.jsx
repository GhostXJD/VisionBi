import Navbar from '../components/Navbar';

function PresentacionPage() {
    return (
        <div>
            <Navbar />
            <div className="py-16">
                <div className="container m-auto px-6 md:px-12 xl:px-6">
                    <div className="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
                        <div className="md:5/12 lg:w-5/12">
                            <img
                                src="https://www.axiomafv.com/wp-content/uploads/2017/11/prediccion-de-ventas-700x433.jpg"
                                alt="image"
                                loading="lazy"
                            />
                        </div>
                        <div className="md:7/12 lg:w-6/12">
                            <h2 className="text-2xl font-bold md:text-4xl">Visión BI: Transformando Datos en Estrategia</h2>
                            <p className="mt-6 ">
                                En nuestra empresa, nuestra visión de Business Intelligence (BI) es la clave de nuestro éxito. Estamos dedicados a aprovechar la inteligencia de negocios para tomar decisiones informadas y estratégicas que nos permitan innovar y crear soluciones excepcionales.
                            </p>
                            <p className="mt-4 ">
                                ¿Cómo lo hacemos? Implementamos tecnologías avanzadas, procesos eficientes y una cultura orientada a datos que nos ayuda a recopilar, analizar y presentar datos de manera efectiva. Con nuestra Visión BI, estamos transformando datos en estrategia y logrando un futuro más brillante para nuestro negocio.
                            </p>
                            <p className="mt-4 ">
                                Únete a nosotros en este emocionante viaje hacia la toma de decisiones informadas y el éxito empresarial sostenible.
                            </p>
                        </div>
                    </div>
                </div>
            </div>



            <section className="pt-20 pb-10 lg:pt-[120px] lg:pb-20">
                <div className="container mx-auto">
                    <div className="-mx-4 flex flex-wrap">
                        <div className="w-full px-4 md:w-1/2 lg:w-1/3">
                            <div className="mx-auto mb-10 max-w-[370px]">
                                <div className="mb-8 overflow-hidden rounded">
                                    <img
                                        src="https://cdn.tailgrids.com/2.0/image/application/images/blogs/blog-01/image-01.jpg"
                                        alt="image"
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-dark hover:text-primary mb-4 inline-block text-xl font-semibold sm:text-2xl lg:text-xl xl:text-2xl">
                                        Nuestra Historia
                                    </h3>
                                    <p className="text-body-color text-base">
                                        Descubre cómo comenzamos y cómo hemos crecido a lo largo de los años. Desde nuestros humildes comienzos hasta convertirnos en lo que somos hoy.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full px-4 md:w-1/2 lg:w-1/3">
                            <div className="mx-auto mb-10 max-w-[370px]">
                                <div className="mb-8 overflow-hidden rounded">
                                    <img
                                        src="https://cdn.tailgrids.com/2.0/image/application/images/blogs/blog-01/image-02.jpg"
                                        alt="image"
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-dark hover:text-primary mb-4 inline-block text-xl font-semibold sm:text-2xl lg:text-xl xl:text-2xl">
                                        Nuestra Visión y Misión
                                    </h3>
                                    <p className="text-body-color text-base">
                                        Conoce nuestra visión para el futuro y nuestra misión para servir a nuestros clientes y la comunidad. Nos esforzamos por...
                                    </p>
                                </div>

                            </div>
                        </div>
                        <div className="w-full px-4 md:w-1/2 lg:w-1/3">
                            <div className="mx-auto mb-10 max-w-[370px]">
                                <div className="mb-8 overflow-hidden rounded">
                                    <img
                                        src="https://cdn.tailgrids.com/2.0/image/application/images/blogs/blog-01/image-03.jpg"
                                        alt="image"
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-dark hover:text-primary mb-4 inline-block text-xl font-semibold sm:text-2xl lg:text-xl xl:text-2xl">
                                        Nuestros Valores
                                    </h3>
                                    <p className="text-body-color text-base">
                                        En nuestra empresa, nos guían principios fundamentales. Descubre cuáles son nuestros valores y cómo los aplicamos en todo lo que hacemos.
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default PresentacionPage;