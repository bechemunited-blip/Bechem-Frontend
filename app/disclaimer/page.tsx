import PageHeader from "@/components/layout/PageHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Disclaimer | Bechem United FC",
    description: "Legal Disclaimer for Bechem United Football Club",
};

export default function DisclaimerPage() {
    return (
        <main className="bg-neutral-1 min-h-screen">
            <PageHeader title="Disclaimer" />

            <section className="container-narrow py-12 md:py-20 lg:py-28">
                <div className="prose prose-neutral max-w-none">
                    <p className="text-neutral-7 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                    <div className="space-y-12">
                        <div>
                            <h2 className="text-2xl font-bold text-primary mb-4 uppercase tracking-wide">1. General Information</h2>
                            <p className="text-neutral-8 leading-relaxed">
                                The information provided by Bechem United Football Club (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) on our website is for general informational purposes only. All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-primary mb-4 uppercase tracking-wide">2. Match Information and Tickets</h2>
                            <p className="text-neutral-8 leading-relaxed">
                                Match dates, kick-off times, and venues are subject to change. While we strive to provide the most up-to-date information, Bechem United FC is not responsible for any changes made by the Ghana Football Association (GFA) or other governing bodies. Ticket availability and prices are also subject to change without notice.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-primary mb-4 uppercase tracking-wide">3. External Links</h2>
                            <p className="text-neutral-8 leading-relaxed">
                                Our website may contain links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-primary mb-4 uppercase tracking-wide">4. Limitation of Liability</h2>
                            <p className="text-neutral-8 leading-relaxed">
                                Under no circumstance shall Bechem United FC have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-primary mb-4 uppercase tracking-wide">5. Errors and Omissions</h2>
                            <p className="text-neutral-8 leading-relaxed">
                                While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, Bechem United FC is not responsible for any errors or omissions, or for the results obtained from the use of this information.
                            </p>
                        </div>

                        <div className="pt-8 border-t border-neutral-3">
                            <p className="text-neutral-7 italic">
                                By using our website, you hereby consent to our disclaimer and agree to its terms. If you require any more information or have any questions about our site&apos;s disclaimer, please feel free to contact us by email at <a href="mailto:info@bechemunitedfc.com" className="text-primary font-semibold hover:underline">info@bechemunitedfc.com</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
