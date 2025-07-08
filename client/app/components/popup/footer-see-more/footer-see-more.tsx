import { Link } from "@remix-run/react"
import { useDispatch } from "react-redux";
import { closeFooterSeeMore } from "~/redux/features/popup/popupSlice";

export const FooterSeeMore = () => {
    const dispatch = useDispatch();
    return (
        <div className="fixed w-screen h-screen top-0 left-0 z-10 bg-[#00000080] transition-all duration-[.15s] ease-linear p-3 flex justify-center items-start overflow-y-auto">
            <div className="bg-linear-[90deg,#384ef4,#b060ed] rounded-[22px] p-[5px] max-w-[50rem] w-full border border-[#00000033]">
                <div className="bg-white rounded-[20px] px-4 py-[3.125rem] md:px-[1.625rem] flex flex-col relative">
                    <button className="cursor-pointer absolute right-4 top-[1.625rem]" type="button" onClick={() => dispatch(closeFooterSeeMore())}>
                        <svg className="w-[0.859rem] fill-[#858796]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                            <path
                                d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                            />
                        </svg>
                    </button>
                    <div>
                        <h3 className="text-title font-semibold leading-[1.4] text-[1.375rem] mb-6">Global LEGAL DISCLAIMER & TERMS OF USE/CONDITIONS</h3>
                        <p><span className="font-bold">Last Updated:</span> 20.03.2025</p>
                        <p className="mb-4">
                            Welcome to www.waqarzaka.net (the "Website"). By accessing or using this Website, you agree to the following disclaimers, terms, and policies. If you do not agree with any part of this
                            disclosure, please discontinue use immediately.
                        </p>
                        <p className="mb-4">For <Link className="text-[#0d6efd]" to="/">www.waqarzaka.net</Link> & All Associated Signal / Telegram / WhatsApp Groups</p>
                        <h5 className="text-title font-semibold leading-[1.4] text-xl mb-2">Educational & Informational Use Only</h5>
                        <p className="mb-4">
                            All content, crypto signals, trading strategies, commentary, or communications shared via <Link className="text-[#0d6efd]" to="/">www.waqarzaka.net</Link> or its affiliated platforms (including
                            but not limited to Signal, Telegram, WhatsApp, or email) are intended solely for educational and informational purposes.
                        </p>

                        <p className="mb-4">They are not a substitute for professional financial, legal, or tax advice.</p>
                        <h5 className="text-title font-semibold leading-[1.4] text-xl mb-2">No Financial Advice – Opinions Only (with Global Jurisdictional Disclaimer)</h5>
                        <p className="mb-4">
                            Waqar Zaka and his team may share personal opinions, trade setups, and buy/sell signals as part of their educational services. However, all such content is provided strictly for
                            informational purposes and does not constitute financial advice, portfolio management, or a recommendation to trade any specific asset.
                        </p>
                        <p className="mb-4">You acknowledge and agree that:</p>
                        <p className="mb-4">Waqar Zaka and his team are not licensed financial advisors, brokers, or investment professionals in any jurisdiction, including but not limited to:</p>
                        <ul className="list-disc pl-8 text-[#858796] mb-4">
                            <li className="py-[0.313rem]">The United States (SEC, CFTC, FINRA),</li>
                            <li className="py-[0.313rem]">The United Kingdom (FCA),</li>
                            <li className="py-[0.313rem]">The European Union (ESMA),</li>
                            <li className="py-[0.313rem]">The United Arab Emirates (SCA, DFSA),</li>
                            <li className="py-[0.313rem]">Singapore (MAS) and all other global regulatory bodies.</li>
                        </ul>
                        <p className="mb-4">All information shared is general in nature, not customized to your financial circumstances, and does not establish any fiduciary duty or client-advisor relationship.</p>
                        <p className="mb-4">Waqar Zaka and his team do not solicit, induce, or guarantee any outcome or return. Past performance is not indicative of future results.</p>
                        <p className="mb-4">
                            By using our content, you waive all claims of misrepresentation, reliance, market manipulation, or legal liability under any financial services or securities regulation worldwide.
                        </p>
                        <h5 className="text-title font-semibold leading-[1.4] text-xl mb-2">No Guarantee of Results</h5>
                        <p className="mb-4">We make no warranties, express or implied, regarding the accuracy, reliability, timeliness, or future performance of any content.</p>
                        <p className="mb-4">You acknowledge that all forms of trading and investing carry inherent risks, including the loss of your entire capital.</p>
                        <h5 className="text-title font-semibold leading-[1.4] text-xl mb-2">Jurisdictional Restrictions</h5>
                        <p className="mb-4">Our services are not intended for use in jurisdictions where the transmission or use of such content would be unlawful or restricted.</p>
                        <p className="mb-4">You are solely responsible for ensuring your participation complies with local laws, financial regulations, and restrictions.</p>
                        <h5 className="text-title font-semibold leading-[1.4] text-xl mb-2">Limitation of Liability</h5>
                        <p className="mb-4">
                            Waqar Zaka and all related parties (including team members, affiliates, contractors, and contributors) shall not be held liable for any form of damages — direct, indirect, incidental,
                            punitive, or consequential — including but not limited to:
                        </p>
                        <ul className="list-disc pl-8 text-[#858796] mb-4">
                            <li className="py-[0.313rem]">Loss of capital or profits,</li>
                            <li className="py-[0.313rem]">Missed trades or opportunities,</li>
                            <li className="py-[0.313rem]">Trading errors based on content reliance,</li>
                            <li className="py-[0.313rem]">Or emotional, legal, or financial distress.</li>
                        </ul>
                        <p className="mb-4">This limitation applies regardless of the legal theory, even if advised of the possibility of such damages.</p>
                        <h5 className="text-title font-semibold leading-[1.4] text-xl mb-2">Personal Responsibility & Risk Acceptance</h5>
                        <p className="mb-4">You are solely responsible for:</p>
                        <ul className="list-disc pl-8 text-[#858796] mb-4">
                            <li className="py-[0.313rem]">Evaluating all shared information,</li>
                            <li className="py-[0.313rem]">Conducting your own due diligence,</li>
                            <li className="py-[0.313rem]">Consulting with a qualified financial professional,</li>
                            <li className="py-[0.313rem]">Making independent investment or trading decisions.</li>
                        </ul>
                        <p className="mb-4">
                            By participating, you voluntarily assume all risks, and agree to indemnify and hold harmless Waqar Zaka and associated parties from any legal action, claim, or loss arising out of your
                            use of our services.
                        </p>
                        <h5 className="text-title font-semibold leading-[1.4] text-xl mb-2">No Refund – No Chargeback Policy</h5>
                        <p className="mb-4">Due to the nature of digital and educational content, all payments made for services, access, or subscriptions are non-refundable.</p>
                        <p className="mb-4">By proceeding with any payment, you waive any right to refunds, disputes, or chargebacks, regardless of perceived results or experience.</p>
                        <h5 className="text-title font-semibold leading-[1.4] text-xl mb-2">Binding Agreement</h5>
                        <p className="mb-4">By accessing <a className="text-[#0d6efd]" href="#">www.waqarzaka.net</a> or any related groups, you confirm that you:</p>
                        <ul className="list-disc pl-8 text-[#858796] mb-4">
                            <li className="py-[0.313rem]">Have read, understood, and accepted this disclaimer in full,</li>
                            <li className="py-[0.313rem]">Enter into a binding agreement,</li>
                            <li className="py-[0.313rem]">And irrevocably waive any future legal claims based on reliance, misunderstanding, or dissatisfaction.</li>
                        </ul>
                        <p className="mb-4">
                            This disclaimer shall be governed by applicable international and local laws, and any disputes shall be resolved under the jurisdiction Waqar Zaka or his company designates.
                        </p>
                        <h6 className="mb-5">Final Note</h6>
                        <p className="mb-4">You trade at your own risk.</p>
                        <p className="mb-4">Waqar Zaka and his team are not responsible for your profits, losses, decisions, or emotions.</p>
                        <p className="mb-4">Your risk. Your decision. Your responsibility.</p>
                        <h5 className="text-title font-semibold leading-[1.4] text-xl mb-2">GENERAL DISCLAIMER</h5>
                        <p className="mb-4">
                            This Website is for educational and informational purposes only. We do not provide financial, investment, legal, or tax advice. Any content, materials, or courses available on this
                            platform should not be construed as professional financial guidance. Before making any trading or investment decisions, consult with a licensed financial advisor, attorney, or tax
                            professional to assess your individual circumstances.
                        </p>
                        <h5 className="text-title font-semibold leading-[1.4] text-xl mb-2">NO FINANCIAL OR INVESTMENT ADVICE</h5>
                        <p className="mb-4">
                            We are not financial advisors, brokers, or investment professionals. No content on this Website constitutes financial, investment, or legal advice. Any financial or trading decisions you
                            make based on our content are at your own risk. Past performance of financial markets, cryptocurrencies, or trading strategies is not indicative of future results.
                        </p>
                        <h5 className="text-title font-semibold leading-[1.4] text-xl mb-2">Risk Disclosure</h5>
                        <p className="mb-4">
                            Trading and investing involve substantial risk, including potential loss of your entire investment. The cryptocurrency and forex markets are highly volatile and not suitable for all
                            investors. You should only trade or invest money that you can afford to lose.
                        </p>
                        <h5 className="text-title font-semibold leading-[1.4] text-xl mb-2">Personal Responsibility</h5>
                        <p className="mb-4">
                            By using this Website, you acknowledge that you are solely responsible for your financial decisions. We are not liable for any financial losses, damages, or negative outcomes from using
                            our educational materials
                        </p>
                        <p className="mb-4">
                            We do not guarantee any specific financial outcomes, earnings, or success from using our content. Any testimonials, success stories, or examples are exceptional cases and not typical
                            results. Your personal financial success depends on various factors outside our control, including market conditions, experience, and risk tolerance.
                        </p>
                        <p className="mb-4">
                            All information is provided "as is" and "as available", with no warranties of accuracy, completeness, or reliability. We strive to provide up-to-date information, but we do not guarantee
                            that all content is free from errors, omissions, or outdated material. By accessing this Website, you agree that we, our owners, employees, and affiliates are not responsible for any
                            financial losses resulting from your reliance on our content.
                        </p>
                        <p className="mb-4">This Website may include links to third-party websites, sponsored content, or affiliate promotions.</p>
                        <p className="mb-4">
                            We do not own, control, or guarantee the accuracy, reliability, or legitimacy of third-party services. If you engage with third-party services through our links, you do so at your own
                            risk, and we are not responsible for any issues or disputes arising from those engagements. We may earn a commission from affiliate links, but this does not influence our content
                            recommendations.
                        </p>
                        <p className="mb-4">By using this Website, you acknowledge that you have read and understood our Privacy Policy, which outlines:</p>
                        <p className="mb-4">What personal data we collect (e.g., email, payment details, analytics).</p>
                        <p className="mb-4">How we use and store data.</p>
                        <p className="mb-4">Third-party sharing policies</p>
                        <p className="mb-4">User rights, including data deletion requests</p>
                        <p className="mb-4">For more details, refer to our Privacy Policy page.</p>
                        <p className="mb-4">All sales of digital products, including courses, are final and non-refundable, except in cases of accidental duplicate purchases</p>
                        <p className="mb-4">Users may not copy, distribute, or reproduce any content without written permission. Unauthorized use of our content may result in legal action</p>
                        <p className="mb-4">
                            Users must not engage in fraud, harassment, illegal activities, or violation of these terms. We reserve the right to suspend or terminate any user account that violates these terms
                        </p>
                        <p className="mb-4">To the fullest extent permitted by law, we shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from:</p>
                        <p className="mb-4">Use of or inability to use our Website.</p>
                        <p className="mb-4">Errors or inaccuracies in content.</p>
                        <p className="mb-4">Third-party services or external links.</p>
                        <p className="mb-4">Loss of profits, revenue, or financial losses.</p>
                        <p>We reserve the right to modify or update this legal disclosure at any time without prior notice. It is your responsibility to review this page periodically for any changes.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
