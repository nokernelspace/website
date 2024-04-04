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
    const handleMouseMove = (event: any) => {
        setMousePosition?.({
            x: event.clientX,
            y: event.clientY,
        });
    };

    useEffect(() => {
        if (typeof window !== "undefined" && typeof document !== "undefined") {
            const handleVisibilityChange = (event: any) => {
                setIsVisible(document.visibilityState);
            };
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("visibilitychange", handleVisibilityChange);
            setIsVisible(document.visibilityState);
            setIsFocus(document.hasFocus() ? "focus" : "blur");

            const onFocus = () => setIsFocus("focus");
            const onBlur = () => setIsFocus("blur");

            window.addEventListener("focus", onFocus);
            window.addEventListener("blur", onBlur);

            return () => {
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