import PageHeader from "@/components/layout/PageHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Bechem United FC",
    description: "Privacy Policy for Bechem United Football Club",
};

export default function PrivacyPolicyPage() {
    return (
        <main className="bg-neutral-1 min-h-screen">
            <PageHeader title="Privacy Policy" />

            <section className="container-narrow py-12 md:py-20 lg:py-28">
                <div className="prose prose-neutral max-w-none">
                    <p className="text-neutral-7 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                    <div className="space-y-12">
                        <div>
                            <h2 className="text-2xl font-bold text-primary mb-4 uppercase tracking-wide">1. Introduction</h2>
                            <p className="text-neutral-8 leading-relaxed">
                                Welcome to Bechem United Football Club (BUFC). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-primary mb-4 uppercase tracking-wide">2. The Data We Collect</h2>
                            <p className="text-neutral-8 leading-relaxed mb-4">
                                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                            </p>
                            <ul className="list-disc pl-6 text-neutral-8 space-y-2">
                                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                                <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
                                <li><strong>Marketing and Communications Data:</strong> includes your preferences in receiving marketing from us and our third parties and your communication preferences.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-primary mb-4 uppercase tracking-wide">3. How We Use Your Data</h2>
                            <p className="text-neutral-8 leading-relaxed mb-4">
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 text-neutral-8 space-y-2">
                                <li>To register you as a new fan or customer.</li>
                                <li>To process and deliver your orders for tickets or merchandise.</li>
                                <li>To manage our relationship with you which will include notifying you about changes to our terms or privacy policy.</li>
                                <li>To enable you to partake in a prize draw, competition or complete a survey.</li>
                                <li>To deliver relevant website content and advertisements to you and measure or understand the effectiveness of the advertising we serve to you.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-primary mb-4 uppercase tracking-wide">4. Data Security</h2>
                            <p className="text-neutral-8 leading-relaxed">
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-primary mb-4 uppercase tracking-wide">5. Your Legal Rights</h2>
                            <p className="text-neutral-8 leading-relaxed">
                                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access to your personal data, request correction of your personal data, request erasure of your personal data, object to processing of your personal data, and the right to withdraw consent.
                            </p>
                        </div>

                        <div className="pt-8 border-t border-neutral-3">
                            <p className="text-neutral-7 italic">
                                If you have any questions about this privacy policy or our privacy practices, please contact us at <a href="mailto:info@bechemunitedfc.com" className="text-primary font-semibold hover:underline">info@bechemunitedfc.com</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
