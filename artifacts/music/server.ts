import { myProvider } from '@/lib/ai/providers';
import { updateDocumentPrompt } from '@/lib/ai/prompts';
import { createDocumentHandler } from '@/lib/artifacts/server';
import { streamObject } from 'ai';
import { z } from 'zod';
import { MusicSheetMetadata } from './types';

// Define the prompt for creating a new music sheet
const musicSheetPrompt = `
You are a music sheet generator specializing in ABC notation. Your job is to translate musical requests into properly formatted ABC notation.
`;

// Define a schema for the music sheet response
const musicSheetSchema = z.object({
  abcNotation: z.string().describe('ABC notation for the music sheet, including both treble and bass clefs if applicable'),
  metadata: z.object({
    title: z.string().describe('Title of the music piece'),
    composer: z.string().describe('Composer of the music piece'),
    timeSignature: z.string().describe('Time signature of the music piece (e.g., 4/4)'),
    keySignature: z.string().describe('Key signature of the music piece (e.g., C)'),
  }),
});

// Create the document handler with the 'music' kind
export const musicDocumentHandler = createDocumentHandler({
  kind: 'music' as any, // Type assertion to bypass constraint check
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = '';

    try {
      console.log(`[music-server] Creating music with title: "${title}"`);
      console.log(`[music-server] System prompt: ${musicSheetPrompt.substring(0, 200)}...`);
      
      const { fullStream } = streamObject({
        model: myProvider.languageModel('artifact-model'),
        system: musicSheetPrompt,
        prompt: title,
        schema: musicSheetSchema,
      });

      for await (const delta of fullStream) {
        const { type } = delta;

        if (type === 'object') {
          const { object } = delta;
          const { abcNotation, metadata } = object;

          if (abcNotation) {
            console.log(`[music-server] Received ABC notation: ${abcNotation.substring(0, 200)}...`);
            
            dataStream.writeData({
              type: 'music-content',
              content: abcNotation,
            });

            draftContent = abcNotation;
          }
          
          if (metadata) {
            dataStream.writeData({
              type: 'music-metadata',
              content: metadata,
            });
          }
        }
      }

      // If we didn't get any content, provide a fallback
      if (!draftContent) {
        const fallbackContent = `X:1
T:${title || 'New Composition'}
C:Anonymous
M:4/4
L:1/4
K:C
V:1 clef=treble
z4 | z4 |
V:2 clef=bass
z4 | z4 |`;
        
        dataStream.writeData({
          type: 'music-content',
          content: fallbackContent,
        });
        
        draftContent = fallbackContent;
      }
    } catch (error) {
      console.error('Error generating music sheet:', error);
      
      // Provide a simple fallback in case of error
      const fallbackContent = `X:1
T:${title || 'New Composition'}
C:Anonymous
M:4/4
L:1/4
K:C
V:1 clef=treble
z4 | z4 |
V:2 clef=bass
z4 | z4 |`;
      
      dataStream.writeData({
        type: 'music-content',
        content: fallbackContent,
      });
      
      draftContent = fallbackContent;
    }

    return draftContent;
  },
  onUpdateDocument: async ({ document, description, dataStream }) => {
    let draftContent = document.content || '';

    try {
      console.log(`[music-server] Updating music with description: "${description}"`);
      console.log(`[music-server] Current ABC notation: "${document.content?.substring(0, 100)}..."`);
      
      // Use a more direct prompt for updates that explicitly refers to the description
      const basePrompt = updateDocumentPrompt(document.content || '', 'music' as any);
      const updatePrompt = `${basePrompt}\n\nThe following description contains the EXACT musical changes requested: "${description}"\n\nImplement these specific changes while maintaining proper ABC notation.`;
      
      console.log(`[music-server] Update system prompt: ${updatePrompt.substring(0, 200)}...`);
      
      console.log(`[music-server] Making API call to update music sheet...`);
      
      const { fullStream } = streamObject({
        model: myProvider.languageModel('artifact-model'),
        system: updatePrompt,
        prompt: description,
        schema: z.object({
          abcNotation: z.string().describe('Updated ABC notation for the music sheet'),
          metadata: z.object({
            title: z.string().describe('Title of the music piece'),
            composer: z.string().describe('Composer of the music piece'),
            timeSignature: z.string().describe('Time signature of the music piece (e.g., 4/4)'),
            keySignature: z.string().describe('Key signature of the music piece (e.g., C)'),
          }).optional(),
        }),
      });

      for await (const delta of fullStream) {
        const { type } = delta;

        if (type === 'object') {
          const { object } = delta;
          const { abcNotation, metadata } = object;

          if (abcNotation) {
            console.log(`[music-server] Received updated ABC notation: ${abcNotation.substring(0, 200)}...`);
            
            dataStream.writeData({
              type: 'music-content',
              content: abcNotation,
            });

            draftContent = abcNotation;
          }
          
          if (metadata) {
            dataStream.writeData({
              type: 'music-metadata',
              content: metadata,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error updating music sheet:', error);
      // In case of update error, keep the original content
      dataStream.writeData({
        type: 'music-content',
        content: draftContent,
      });
    }

    return draftContent;
  },
}); 