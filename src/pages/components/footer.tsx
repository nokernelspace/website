import { useContext } from "react";
import { AppContext } from "./layout";

export default function Footer() {
    const { mousePosition, isFocus, isVisible } = useContext(AppContext);

    return (
        <div className="flex flex-col justify-between sm:flex-row">
            <div className="flex flex-col justify-end order-2 px-8 py-2 text-white sm:order-none">
                <h3>nokernel.space</h3>
                <p>
                    Made with <span style={{ color: "#BA6573" }}>❤</span> by Root
                </p>
                <div className="flex flex-row justify-between">
                    <a
                        href="https://github.com/nokernelspace"
                        target="_blank"
                        className="p-2 bg-black rounded-full link invert-out hover:invert-in"
                    >
                        <img src="/github.svg" width="30px" height="30px" alt="" />
                    </a>
                    <a
                        href="https://soundcloud.com/nokernelspace"
                        target="_blank"
                        className="p-2 bg-black rounded-md link invert-out hover:invert-in"
                    >
                        <img src="/soundcloud.svg" width="30px" height="30px" alt="" />
                    </a>

                    <a
                        href="https://twitter.com/nokernelspace"
                        target="_blank"
                        className="p-2 bg-black rounded-md link invert-out hover:invert-in"
                    >
                        <img src="/twitter.svg" width="30px" height="30px" alt="" />
                    </a>
                </div>
                <p style={{ color: "#818181", fontSize: "smaller" }}>
                    2024 © All Rights Reserved
                </p>
            </div>
            <div className="flex flex-col justify-end px-8 py-2 text-right sm:text-left">
                <p
                    className="box-border flex justify-between mb-2 text-white cursor-pointer md:mb-0 md:underline md:underline-offset-2"
                    data-title="nokernelspace is a collective based in San Francisco"
                >
                    <span className="invisible md:visible"> About</span>
                </p>
                <p
                    className="box-border flex justify-between text-white cursor-pointer md:underline md:underline-offset-2"
                    data-title="Creativity for All"
                >
                    <span className="invisible md:visible">Our Mission</span>
                </p>
                <p
                    className="flex justify-between cursor-pointer text-stone-500"
                    data-title="🚧 wip"
                >
                    <span className="invisible md:visible">Products</span>
                </p>
                <p
                    className="box-border flex justify-between text-white cursor-pointer md:underline md:underline-offset-2"
                    data-title="root@nokernel.space"
                >
                    <span className="invisible md:visible"> Partner with us</span>
                </p>
            </div>
            <div className="flex flex-col justify-end px-8 py-2 text-right basis-1/3 sm:text-left">
                <p className="text-white">
                    {navigator.userAgent}
                </p>

                <p className="text-white">{"localhost"}:</p>
                <p className="text-white">
                    {mousePosition?.x} {mousePosition?.y} | {isVisible?.toString()} |{" "}
                    {isFocus?.toString()}
                </p>
            </div>
        </div>
    );
}