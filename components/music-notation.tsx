'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Script from 'next/script';

// Global flag to track if ABCJS is loaded
let abcjsLoaded = false;

interface MusicNotationProps {
  abcNotation: string;
}

export const MusicNotation = ({ abcNotation }: MusicNotationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(abcjsLoaded);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [showRawNotation, setShowRawNotation] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Handle script load event
  const handleScriptLoad = () => {
    console.log('ABCJS script loaded');
    abcjsLoaded = true;
    setScriptLoaded(true);
  };

  const renderNotation = useCallback(() => {
    if (containerRef.current && window.ABCJS && abcNotation) {
      try {
        window.ABCJS.renderAbc(containerRef.current, abcNotation, {
          responsive: "resize",
          add_classes: true,
          paddingbottom: 20,
          paddingleft: 20,
          paddingright: 20,
          paddingtop: 15,
          staffwidth: 700,
          scale: zoom,
          wrap: {
            minSpacing: 1.8,
            maxSpacing: 2.7,
            preferredMeasuresPerLine: 4
          },
          format: {
            gchordfont: "Arial",
            composerfont: "Arial",
            titlefont: "Arial",
            vocalfont: "Arial",
            annotationfont: "Arial"
          }
        });
      } catch (error: any) {
        console.error("Error rendering ABC notation:", error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="bg-red-50 border border-red-500 text-red-700 p-4 rounded">
            <p>Error rendering music notation:</p>
            <pre>${error.toString()}</pre>
          </div>`;
        }
      }
    }
  }, [abcNotation, zoom, containerRef]);

  // Render the ABC notation when script is loaded
  useEffect(() => {
    if (!scriptLoaded || !containerRef.current || !abcNotation) return;

    renderNotation();
  }, [abcNotation, scriptLoaded, renderNotation]);

  return (
    <div className="w-full">
      {/* Load ABCJS from CDN (only once) */}
      {!abcjsLoaded && (
        <Script
          src="https://cdn.jsdelivr.net/npm/abcjs@6.2.3/dist/abcjs-basic.js"
          strategy="afterInteractive"
          onLoad={handleScriptLoad}
        />
      )}
      
      {renderError ? (
        <div className="text-red-500 p-4 border rounded">
          <p className="font-bold mb-2">Error rendering music notation:</p>
          <p>{renderError}</p>
          <pre className="p-2 bg-gray-100 rounded mt-2 overflow-auto text-xs">
            {abcNotation}
          </pre>
        </div>
      ) : (
        <>
          {/* Container for ABC notation rendering */}
          <div 
            ref={containerRef} 
            className="music-notation-container p-2 rounded overflow-x-auto"
          />
          
          {/* Loading state */}
          {!scriptLoaded && (
            <div className="text-center p-4 bg-gray-50 rounded border">
              Loading music notation library...
            </div>
          )}
          
          {/* Toggle raw notation display */}
          <div className="flex justify-end mt-2">
            <button
              className="text-xs px-2 py-1 border rounded hover:bg-gray-100"
              onClick={() => setShowRawNotation(!showRawNotation)}
            >
              {showRawNotation ? "Hide ABC notation" : "Show ABC notation"}
            </button>
          </div>
          
          {/* Display raw ABC notation for debugging */}
          {showRawNotation && (
            <pre className="p-2 bg-gray-50 border rounded mt-2 overflow-auto text-xs">
              {abcNotation}
            </pre>
          )}
        </>
      )}
    </div>
  );
};

// Type definition for the ABCJS global
declare global {
  interface Window {
    ABCJS: {
      renderAbc: (element: HTMLElement, notation: string, options?: any) => void;
    };
  }
} 