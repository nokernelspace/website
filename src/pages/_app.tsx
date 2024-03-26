import "../styles/globals.css";
import "../styles/animations.css";
import type { AppProps } from "next/app";
import AppContext from '../context.js';
import { useState, useEffect } from "react";
import {mobile_threshold} from './config.json';

export default function App({ Component, pageProps }: AppProps) {
  let [loading, setLoading] = useState(0);

  useEffect(() => {
    // This code will run whenever `loading` changes
    if (loading == 1) {
      // Start the loading animation
      document.body.classList.add('loading-out');
    } else if (loading == -1) {
      // Stop the loading animation
      document.body.classList.remove('loading-in');
    }
  }, [loading]);


  return (
    <AppContext.Provider value={{ loading, setLoading }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}
