import { FacebookIcon, MailIcon, TwitterIcon } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export function Footer() {
    return (
        <nav
            className="
        flex w-full mt-auto
        flex-row flex-wrap
        items-center justify-center
        gap-4
        bg-[#F5F5F5]
        text-[1rem]
        px-4 py-3
        md:gap-4 md:text-[1rem]
        max-md:flex-col max-md:gap-3 max-md:px-4 max-md:py-4 max-md:text-[1rem]
      "
        >
            <img
                src="/logo.png"
                alt="UFRA Playzone"
                className="h-12 w-12 bg-transparent md:h-14 md:w-14 max-md:h-14 max-md:w-14 max-[479px]:h-12 max-[479px]:w-12"
            />

            <a className="inline-flex items-center justify-center text-[#116A24] text-sm">
                suporte@ufraplayzone.com.br
            </a>

            <a className="inline-flex items-center justify-center text-[#116A24] text-sm">
                &copy; 2026 UFRA Playzone
            </a>

            <div className="flex gap-2 bg-transparent max-md:gap-3">
                <a className="inline-flex items-center justify-center text-[#116A24] bg-transparent">
                    <FaWhatsapp size={20} style={{ color: "#117A24", fill: "#117A24" }} />
                </a>

                <a className="inline-flex items-center justify-center text-[#116A24] bg-transparent">
                    <FacebookIcon className="h-5 w-5 md:h-5 md:w-5 max-md:h-6 max-md:w-6" />
                </a>

                <a className="inline-flex items-center justify-center text-[#116A24] bg-transparent">
                    <MailIcon className="h-5 w-5 md:h-5 md:w-5 max-md:h-6 max-md:w-6" />
                </a>

                <a className="inline-flex items-center justify-center text-[#116A24] bg-transparent">
                    <TwitterIcon className="h-5 w-5 md:h-5 md:w-5 max-md:h-6 max-md:w-6" />
                </a>
            </div>

            <a className="inline-flex items-center justify-center text-[#116A24] text-sm">
                Política de Privacidade
            </a>
        </nav>
    );
}
