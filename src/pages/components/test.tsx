import { useEffect, ComponentType, useState } from "react";
import React from "react";

interface ComponentTest {
    components: ComponentType[];
}

export default function HelloWorld(){
    return (<p>Hello World</p>);
}

export function ComponentTest({ children }: any) {
    let [componentIdx, setComponentIdx] = useState(0);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            console.log(`Key pressed: ${event.key}`);
            const keyCode = event.keyCode;
            if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105)) {
                setComponentIdx(parseInt(event.key));
            }
        };

        document.body.addEventListener('keydown', handleKeyDown);

        // Cleanup function to remove the event listener when the component unmounts
        return () => {
            document.body.removeEventListener('keydown', handleKeyDown);
        };
        //   fetch('/api/track') // replace with your API endpoint
        //     .then(response => response.json())
        //     .then(data => setData(data));
    }, []); // Empty dependency array means this effect will only run once, when the component mounts

    return (
        <div className="w-full h-full">
            {
                React.Children.toArray(children).map((child, index) => {
                    if (index == componentIdx) {
                        return child;
                    }
                    else {
                        return null;
                    }
                })
            }
        </div>
    );
}