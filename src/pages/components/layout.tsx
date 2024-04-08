import React from "react";
import { useEffect, useState } from "react";

type AppContextType = {
    mousePosition?: { x: number; y: number };
    setMousePosition?: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
    isFocus?: string;
    setIsFocus?: React.Dispatch<React.SetStateAction<string>>;
    isVisible?: string;
    setIsVisible?: React.Dispatch<React.SetStateAction<string>>;
    // Add other state variables and setters here
};

export const AppContext = React.createContext<AppContextType>({});

export default function Layout({ children }: any) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState("");
    const [isFocus, setIsFocus] = useState("");
    const handleWheel = (event: any) => {
        console.log(event);
        // Add your scrolling logic here
    };
    const handleMouseMove = (event: any) => {
        setMousePosition?.({
            x: event.clientX,
            y: event.clientY,
        });
    };

    // Global Window/Document Setup
    useEffect(() => {
        // Skip on server size rendering. This is only to make the client interactive
        if (typeof window !== "undefined" && typeof document !== "undefined") {
            // window.opener refers to the tab that opened the window ...  :eyes:
            // console.log(window.opener);

            // This event seems to be specifically fired when the tabs are changed
            const handleVisibilityChange = (event: any) => {
                // console.log(event);
                setIsVisible(document.visibilityState);
            };
            setIsVisible(document.visibilityState);
            setIsFocus(document.hasFocus() ? "focus" : "blur");

            const onFocus = () => setIsFocus("focus");
            const onBlur = () => setIsFocus("blur");


            /* Register the Events */
            window.addEventListener('wheel', handleWheel);
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("focus", onFocus);
            window.addEventListener("blur", onBlur);
            window.addEventListener("visibilitychange", handleVisibilityChange);

            /* De-Register the Events, can lead to memory leaks*/
            return () => {
                window.removeEventListener('wheel', handleWheel);
                window.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener(
                    "visibilitychange",
                    handleVisibilityChange
                );
                window.removeEventListener("focus", onFocus);
                window.removeEventListener("blur", onBlur);
            };
        }
    }, []);

    return (
        <AppContext.Provider value={{ mousePosition, isVisible, isFocus, setMousePosition, setIsVisible, setIsFocus }}>
            {children}
        </AppContext.Provider>
    );
}