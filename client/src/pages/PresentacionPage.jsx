function PresentationPage() {
    return (
        <div>
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
                            <h2 className="text-2xl font-bold md:text-4xl">BI Vision: Transforming Data into Strategy</h2>
                            <p className="mt-6">
                                In our company, our vision of Business Intelligence (BI) is the key to our success. We are dedicated to leveraging business intelligence to make informed and strategic decisions that enable us to innovate and create exceptional solutions.
                            </p>
                            <p className="mt-4">
                                How do we do it? We implement advanced technologies, efficient processes, and a data-oriented culture that helps us collect, analyze, and present data effectively. With our BI Vision, we are transforming data into strategy and achieving a brighter future for our business.
                            </p>
                            <p className="mt-4">
                                Join us on this exciting journey toward informed decision-making and sustainable business success.
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
                                        Our History
                                    </h3>
                                    <p className="text-body-color text-base">
                                        Discover how we started and how we've grown over the years. From our humble beginnings to what we are today.
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
                                        Our Vision and Mission
                                    </h3>
                                    <p className="text-body-color text-base">
                                        Learn about our vision for the future and our mission to serve our customers and the community. We strive to...
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
                                        Our Values
                                    </h3>
                                    <p className="text-body-color text-base">
                                        In our company, fundamental principles guide us. Discover what our values are and how we apply them in everything we do.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default PresentationPage;
