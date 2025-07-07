import { useDispatch } from "react-redux";
import { closeSeeMore } from "~/redux/features/popup/popupSlice";

export const SeeMore = () => {
    const dispatch = useDispatch();
    const handleClose = () => {
        dispatch(closeSeeMore());
    };
    
    return (
        <div
            className="fixed w-screen h-screen top-0 left-0 z-10 bg-[#00000080] transition-all duration-[.15s] ease-linear p-3 flex justify-center items-center overflow-y-auto"
            id="seemore-popup"
        >
            <div
                className="bg-gradient-to-r from-[#384ef4] to-[#b060ed] rounded-[22px] p-[5px] max-w-[50rem] w-full border border-[#00000033]"
            >
                <div
                    className="bg-white rounded-[20px] p-[3.125rem] px-4 md:px-[1.625rem] flex flex-col relative"
                >
                    <button
                        className="cursor-pointer absolute right-4 top-[1.625rem]"
                        onClick={handleClose}
                    >
                        <svg
                            className="w-[0.859rem] fill-[#858796]"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 384 512"
                        >
                            <path
                                d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                            />
                        </svg>
                    </button>
                    <div className="space-y-[0.313rem]">
                        <p>
                            By joining our paid program, you will gain access to
                            real-time investment insights from Waqar Zaka, a day trader
                            and early-stage investor in crypto projects. Some days, you
                            may see multiple spot and futures trades; other times,
                            there may be no trades for weeks—it all depends on market
                            conditions. There is no fixed schedule for trades, and this
                            is not a signal group. Waqar Zaka shares where he is
                            investing, and you must make your own decisions based on
                            your financial knowledge and risk tolerance.
                        </p>
                        <p>
                            This program includes both text-based learning and video
                            content, with live market updates twice a day where we
                            showcase real-time trades. However, we do not guarantee
                            profits or financial success. Like a gym membership,
                            results depend on individual effort—only those who actively
                            learn and apply the knowledge may benefit.
                        </p>
                        <p>
                            Important: We will never ask you to send money to us or any
                            individual claiming to be Waqar Zaka. We are an educational
                            platform, not portfolio managers. If you seek portfolio
                            management services, consider professional firms like
                            BlackRock USA.
                        </p>
                        <p>
                            No Refund Policy: There are no refunds under any
                            circumstances. It is your responsibility to thoroughly
                            research before purchasing a subscription. This paid
                            service only provides exclusive content on where and how
                            Waqar Zaka is investing—it does not guarantee profits. No
                            one in the world can guarantee returns; if someone claims
                            otherwise, they are scammers. If guaranteed profits were
                            possible, firms like BlackRock would advertise them—yet
                            they don’t, because such guarantees do not exist.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}