import { FacebookIcon, MailIcon, TwitterIcon } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export function Footer() {
    return (
        <nav
            className="
        flex w-full mt-auto
        flex-row flex-wrap
        items-center justify-center
        gap-6
        bg-[#F5F5F5]
        text-[1.2rem]
        px-10 py-4
        md:gap-[1.2rem] md:text-[1.1rem]
        max-md:flex-col max-md:gap-[0.8rem] max-md:px-5 max-md:py-6 max-md:text-[1.1rem]
      "
        >
            <img
                src="/logo.png"
                alt="UFRA Playzone"
                className="h-16 w-16 bg-transparent md:h-20 md:w-20 lg:h-16 lg:w-16 max-md:h-[5.2rem] max-md:w-[5.2rem] max-[479px]:h-[4.6rem] max-[479px]:w-[4.6rem]"
            />

            <a className="inline-flex items-center justify-center text-[#116A24]">
                suporte@ufraplayzone.com.br
            </a>

            <a className="inline-flex items-center justify-center text-[#116A24]">
                &copy; 2026 UFRA Playzone
            </a>

            <div className="flex gap-2 bg-transparent max-md:gap-[0.8rem]">
                <a className="inline-flex items-center justify-center text-[#116A24] bg-transparent">
                    <FaWhatsapp size={24} style={{ color: "#117A24", fill: "#117A24" }} />
                </a>

                <a className="inline-flex items-center justify-center text-[#116A24] bg-transparent">
                    <FacebookIcon className="h-6 w-6 md:h-7 md:w-7 max-md:h-8 max-md:w-8" />
                </a>

                <a className="inline-flex items-center justify-center text-[#116A24] bg-transparent">
                    <MailIcon className="h-6 w-6 md:h-7 md:w-7 max-md:h-8 max-md:w-8" />
                </a>

                <a className="inline-flex items-center justify-center text-[#116A24] bg-transparent">
                    <TwitterIcon className="h-6 w-6 md:h-7 md:w-7 max-md:h-8 max-md:w-8" />
                </a>
            </div>

            <a className="inline-flex items-center justify-center text-[#116A24]">
                Política de Privacidade
            </a>
        </nav>
    );
}