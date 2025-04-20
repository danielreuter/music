// Define types for the music sheet artifact
export interface MusicSheetMetadata {
  title: string;
  composer: string;
  timeSignature: string;
  keySignature: string;
}

// Define all the props needed for our content component
export interface MusicContentProps {
  content: string;
  currentVersionIndex: number;
  isCurrentVersion: boolean;
  onSaveContent: (content: string, debounce: boolean) => void;
  status?: 'streaming' | 'idle';
  metadata?: MusicSheetMetadata;
  getDocumentContentById?: (index: number) => string;
  isLoading?: boolean;
  title?: string;
  mode?: 'edit' | 'diff';
  isInline?: boolean;
  suggestions?: any[];
  setMetadata?: (
    updater: MusicSheetMetadata | ((prev: MusicSheetMetadata) => MusicSheetMetadata)
  ) => void;
}

// Types to extend the DataStreamPart types from the AI SDK
declare module 'ai' {
  interface DataStreamPart {
    type: string;
    content: any;
  }
} 