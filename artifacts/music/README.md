# Music Sheet Artifact

This artifact allows users to create, edit, and visualize music scores using ABC notation. It provides an interactive way to work with musical notation in a chat interface.

## Features

- Create and edit music sheets using ABC notation
- Visual rendering of musical scores
- Support for common music notation elements (notes, rests, time signatures, key signatures)
- Metadata display (title, composer, time signature, key)
- Version history and comparison

## Implementation Details

The music sheet artifact consists of the following components:

1. **Client-side component (`client.tsx`)**: Handles the UI rendering, editing interface, and interaction with the ABC notation.
2. **Server-side handler (`server.ts`)**: Processes AI requests to create and modify music sheets.
3. **Music notation component (`components/music-notation.tsx`)**: Renders the ABC notation as a visual music score.
4. **Types (`types.ts`)**: Type definitions for the music sheet artifact.

## ABC Notation

This artifact uses [ABC notation](https://abcnotation.com/), a text-based music notation system that allows you to represent musical scores in plain text. It is human-readable and widely used for folk and traditional music.

Example of ABC notation:

```
X:1
T:Example Tune
C:Anonymous
M:4/4
L:1/4
K:C
C D E F | G A B c | c B A G | F E D C |
```

## Dependencies

This artifact uses the [abcjs](https://www.abcjs.net/) library for rendering ABC notation. The library is loaded dynamically via CDN in the `MusicNotation` component.

## Usage Example

To create a new music sheet, you can start a conversation with prompts like:

- "Create a music sheet for a simple waltz"
- "Write sheet music for Happy Birthday"
- "Compose a short jazz melody in G minor"

To modify an existing music sheet:

- "Add a second voice to this melody"
- "Change the key signature to D major"
- "Make this piece more lively by adding some syncopation"

## Integration Points

The music artifact is integrated into the application through:

1. Adding the artifact kind to the `artifactKinds` array in `lib/artifacts/server.ts`
2. Registering the document handler in `documentHandlersByArtifactKind` array
3. Adding the artifact definition to the `artifactDefinitions` array in `components/artifact.tsx`
4. Updating the document schema in `lib/db/schema.ts` to include the 'music' kind

## Resolving Type Issues

The current implementation uses type assertions (`as any`) to bypass some type constraints. For a proper production implementation, you should:

1. Extend the `ArtifactKind` type in `lib/artifacts/server.ts` to include the 'music' type explicitly.
2. Modify the `DataStreamPart` interface in the AI SDK to include your custom stream part types.
3. Update the `updateDocumentPrompt` function to support the 'music' artifact kind.

Example of how to properly extend the types:

```typescript
// In a global declaration file or module augmentation
declare module "ai" {
  interface DataStreamPart {
    type:
      | "id"
      | "title"
      | "text-delta"
      | "code-delta"
      | "sheet-delta"
      | "image-delta"
      | "suggestion"
      | "clear"
      | "finish"
      | "kind"
      | "music-content"
      | "music-metadata";
    content: any;
  }
}

// In lib/artifacts/server.ts
export const artifactKinds = [
  "text",
  "code",
  "image",
  "sheet",
  "music",
] as const;
export type ArtifactKind = (typeof artifactKinds)[number];
```

## Troubleshooting Common Issues

### DOM Manipulation Errors

The music notation component uses direct DOM manipulation through the abcjs library, which can sometimes conflict with React's virtual DOM. To avoid errors like "Failed to execute 'removeChild' on 'Node'", ensure that:

1. The container div for abcjs is properly cleared before rendering
2. Use proper React state management for component lifecycle
3. Clean up any DOM elements when the component unmounts

## Future Enhancements

Potential improvements to the music sheet artifact could include:

- Audio playback of the music notation
- MIDI export capabilities
- More advanced music notation features (articulations, dynamics, etc.)
- Integration with other music notation formats (MusicXML, LilyPond, etc.)
- Direct integration with music composition tools
- Proper TypeScript declarations for all components
