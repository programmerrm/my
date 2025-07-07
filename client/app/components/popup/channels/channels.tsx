import { Link } from "@remix-run/react";
import demoVideo from "../../../assets/videos/demo.mp4"
import { useDispatch } from "react-redux";
import { closeChannel } from "~/redux/features/popup/popupSlice";

export const Channels = () => {
   const dispatch = useDispatch();
   const handleClose = () => {
      dispatch(closeChannel());
   }

   return (
      <div className="flex justify-center items-center fixed w-screen h-screen top-0 left-0 z-10 bg-[#00000080] transition-all duration-[.15s] ease-linear p-3 overflow-y-auto">
         <div className="bg-linear-[90deg,#384ef4,#b060ed] rounded-[22px] p-[5px] max-w-[50rem] w-full border border-[#00000033]">
            <div className="bg-white rounded-[20px] p-[1.625rem] px-4 md:p-[1.625rem] flex flex-col relative">
               <button className="cursor-pointer absolute right-4 top-[1.625rem]" onClick={handleClose}>
                  <svg className="w-[0.859rem] fill-[#858796]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                     <path
                        d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                     />
                  </svg>
               </button>
               <div className="flex items-center justify-center">
                  <video
                     className="max-w-[23.75rem] w-full rounded"
                     controls
                     loop
                     src={demoVideo}
                  ></video>
               </div>
               <h2 className="text-transparent capitalize bg-gradient-to-r from-[#384ef4] to-[#b060ed] bg-clip-text text-[2.5rem] font-bold text-center leading-normal">
                  broadcast channels
               </h2>
               <p className="max-w-[31.25rem] mx-auto text-center text-xl md:text-lg text-[#1b1b1b] leading-[1.4]">
                  Join our broadcast channels for exclusive crypto and stock
                  insights, and track Waqar Zaka's investments.
               </p>
               <div className="flex flex-col gap-2.5 mt-[1.875rem] md:gap-4 md:flex-row md:justify-center">
                  <Link className="text-[1.063rem] md:text-xl leading-normal text-white rounded-[1.875rem] py-[0.938rem] px-[1.563rem] bg-gradient-to-r from-[#384ef4] to-[#b060ed] text-center min-w-[14.25rem] uppercase transition-all duration-[0.5s] ease-in hover:bg-none hover:text-[#140751] outline-none border border-[#140751] hover:border-[#140751]"
                     to="/"
                     target="_blank"
                  >Insta Broadcast</Link>
                  <Link className="text-[1.063rem] md:text-xl leading-normal hover:text-white rounded-[1.875rem] py-[0.938rem] px-[1.563rem] hover:bg-gradient-to-r from-[#384ef4] to-[#b060ed] text-center min-w-[14.25rem] uppercase transition-all duration-[0.5s] ease-in bg-none text-[#140751] outline-none border border-[#140751] hover:border-[#140751]"
                     to="/"
                     target="_blank"
                  >Insta Broadcast</Link>
               </div>
            </div>
         </div>
      </div>
   );
}
