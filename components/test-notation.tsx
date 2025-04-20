'use client';

import { useState } from 'react';
import { MusicNotation } from './music-notation';

// Simple example with basic notation
const basicExample = `X:1
T:Simple Example
C:Test
M:4/4
L:1/8
K:C
CDEF GABc | cBAG FEDC |`;

// Für Elise example (simplified)
const furEliseBasic = `X:1
T:Für Elise (Simple)
C:Ludwig van Beethoven
M:3/8
L:1/16
K:Am
V:1 clef=treble
e2 ^d2 e2 | ^d2 e2 B2 | d2 c2 A2 | C2 E2 A2 |
V:2 clef=bass
A,,4 A,, | A,,4 A,, | E,4 E, | A,,4 A,, |`;

// Für Elise with chord symbols and more complex notation
const furEliseAdvanced = `X:1
T:Für Elise
C:Ludwig van Beethoven
M:3/8
L:1/16
K:Am
V:1 clef=treble
"Am" e2 ^d2 e2 | ^d2 e2 B2 | d2 c2 A2 | C2 E2 A2 |
"E" B2 e2 c2 | "E7" B2 ^d2 e2 | "Am" d2 c2 A2 | C2 E2 A2 |
V:2 clef=bass
A,,4 A,, | A,,4 A,, | E,4 E, | A,,4 A,, |
E,4 E, | E,4 E, | A,,4 A,, | A,,4 A,, |`;

// Für Elise with advanced features to showcase ABCJS capabilities (simplified for compatibility)
const furEliseComplete = `X:1
T:Für Elise (Complete)
C:Ludwig van Beethoven
Z:Enhanced example with advanced ABC notation features
M:3/8
L:1/16
Q:1/8=80
K:Am
%%MIDI program 1 0
V:1 clef=treble
V:2 clef=bass
[V:1]"_p" !mp! "Am"e4 ^d4 | e4 ^d4 | e4 B4 | d4 c4 | A8 | 
[V:2]"_p" A,,8 | A,,8 | E,,8 | E,,8 | A,,8 |
%%
[V:1] E4 A4 | c4 B4 | A8 | E4 A4 | c4 B4 |
[V:2] A,,8 | E,,8 | A,,8 | A,,8 | E,,8 |
%%
[V:1] "_cresc." !4!A4 !3!B4 | !2!c4 !1!e4 | !fermata!!2!a8 | (3!mf!e2!3!^d2!2!e2 !1!^d2!2!e2 !3!B2 | !2!d2!3!c2 !1!A2 !open!C2!1!E2!3!A2 |
[V:2] "_cresc." A,,8 | A,,8 | A,,8 | !mf!A,,8 | E,,8 |
%%
[V:1] |1 !2!B2!1!e2 !3!c2 !4!B2!1!e2 !3!c2 | !2!d2!3!c2 !1!A2 !open!C2!1!E2!3!A2 :|2 B2!1!e2 !2!g2 !4!a2!1!e2 !2!c'2 | !fff!!accent!a8 z4 ||
[V:2] |1 E,,8 | A,,8 :|2 E,,8 | A,,8 ||
%%
[V:1] [K:C] |: !p!!tenuto!G2E2C2 !staccato!G,2C2E2 | G2c2e2 g2e2c2 | G2E2C2 G,2C2E2 | !trill!G8 z4 :|
[V:2] [K:C] |: C,,8 | C,,8 | C,,8 | G,,8 :|
%%
[V:1] [K:Am] "_Ending" !p!"Am"e4 ^d4 | e4 ^d4 | e4 B4 | d4 c4 | A8 |
[V:2] [K:Am] A,,8 | A,,8 | E,,8 | E,,8 | A,,8 |
%%
[V:1] "_rit." !fermata!A8 | z8 |]
[V:2] "_rit." !fermata!A,,8 | z8 |]`;

export const TestNotation = () => {
  const [selectedExample, setSelectedExample] = useState<'basic' | 'simple' | 'advanced' | 'complete'>('simple');
  
  // Get the selected ABC notation
  const getNotation = () => {
    switch (selectedExample) {
      case 'basic': return basicExample;
      case 'simple': return furEliseBasic;
      case 'advanced': return furEliseAdvanced;
      case 'complete': return furEliseComplete;
      default: return furEliseBasic;
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">ABC Notation Test</h2>
      
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          <button 
            className={`px-3 py-1 border rounded ${selectedExample === 'basic' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setSelectedExample('basic')}
          >
            Basic Example
          </button>
          <button 
            className={`px-3 py-1 border rounded ${selectedExample === 'simple' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setSelectedExample('simple')}
          >
            Für Elise (Simple)
          </button>
          <button 
            className={`px-3 py-1 border rounded ${selectedExample === 'advanced' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setSelectedExample('advanced')}
          >
            Für Elise (Advanced)
          </button>
          <button 
            className={`px-3 py-1 border rounded ${selectedExample === 'complete' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setSelectedExample('complete')}
          >
            Für Elise (Complete)
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Select different examples to test the rendering capabilities.
        </p>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-4">
        <MusicNotation abcNotation={getNotation()} />
      </div>
      
      <div className="mt-4 p-4 bg-gray-50 rounded">
        <h3 className="text-lg font-semibold mb-2">About This Test</h3>
        <p className="mb-2">
          This page tests the ABCJS library&apos;s rendering of ABC notation with different levels of complexity:
        </p>
        <ul className="list-disc ml-6">
          <li><strong>Basic Example</strong>: Simple scales in C major</li>
          <li><strong>Simple Für Elise</strong>: Basic version with treble and bass clefs</li>
          <li><strong>Advanced Für Elise</strong>: Includes chord symbols and more voices</li>
          <li><strong>Complete Für Elise</strong>: Showcases advanced ABC notation features including:
            <ul className="list-disc ml-6 mt-1">
              <li>Multiple voices with proper voice leading</li>
              <li>Dynamics (p, mf, fff) and articulations (tenuto, staccato, accent)</li>
              <li>Fingering numbers</li>
              <li>Repeats and endings</li>
              <li>Ornaments (trills, triplets)</li>
              <li>Fermatas and tempo changes</li>
              <li>Text annotations (cresc., rit.)</li>
              <li>Key changes</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}; 