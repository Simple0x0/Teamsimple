import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function VantaNetBackground() {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    let effectInstance;

    import("vanta/src/vanta.net").then((VANTA) => {
      if (!vantaEffect) {
        effectInstance = VANTA.default({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0x1b1d28,
          color: 0xa3e635, 
        });
        setVantaEffect(effectInstance);
      }
    });

    return () => {
      if (effectInstance) effectInstance.destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}


/*
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const effects = {
  net: () => import("vanta/src/vanta.net"),
  waves: () => import("vanta/src/vanta.waves"),
  dots: () => import("vanta/src/vanta.dots"),
  birds: () => import("vanta/src/vanta.birds"),
  fog: () => import("vanta/src/vanta.fog"),
  topology: () => import("vanta/src/vanta.topology"),
};

export default function VantaBackgroundSwitcher() {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [selectedEffect, setSelectedEffect] = useState("net");

  useEffect(() => {
  let effectInstance = null;
  let isMounted = true;

  if (effects[selectedEffect]) {
    effects[selectedEffect]().then((VANTA) => {
      if (!isMounted || !vantaRef.current) return;

      if (vantaEffect) {
        try {
          vantaEffect.destroy();
        } catch (err) {
          console.warn("Vanta cleanup failed:", err);
        }
      }

      try {
        effectInstance = VANTA.default({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0x1f2937, // bg-gray-800
          color: 0xa3e635, // lime-400
        });

        setVantaEffect(effectInstance);
      } catch (error) {
        console.error("Failed to initialize Vanta effect:", selectedEffect, error);
      }
    });
  }

  return () => {
    isMounted = false;
    if (effectInstance) {
      try {
        effectInstance.destroy();
      } catch (err) {
        console.warn("Vanta destroy error:", err);
      }
    }
  };
}, [selectedEffect]);


  return (
    <>
      <div
        ref={vantaRef}
        className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      />

      <div className="fixed top-4 right-4 z-10 bg-slate-800 p-2 rounded-md shadow-md">
        <label htmlFor="vanta-effect" className="text-white text-sm mr-2">Background</label>
        <select
          id="vanta-effect"
          className="bg-slate-700 text-white text-sm p-1 rounded-md"
          value={selectedEffect}
          onChange={(e) => setSelectedEffect(e.target.value)}
        >
          {Object.keys(effects).map((key) => (
            <option key={key} value={key}>
              {key.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

*/