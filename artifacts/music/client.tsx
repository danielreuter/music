import { Artifact } from '@/components/create-artifact';
import {
  CopyIcon,
  PlayIcon,
  RedoIcon,
  SparklesIcon,
  UndoIcon,
} from '@/components/icons';
import { MusicNotation } from '@/components/music-notation';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { MusicContentProps, MusicSheetMetadata } from './types';

// Helper function to create a React component rendering the content
const MusicContent = ({
  content,
  currentVersionIndex,
  isCurrentVersion,
  onSaveContent,
  metadata,
}: MusicContentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(content || '');
  
  // Update the editable content when the actual content changes
  useEffect(() => {
    if (content !== editableContent && !isEditing) {
      console.log('Content changed, updating:', content);
      setEditableContent(content || '');
    }
  }, [content, editableContent, isEditing]);
  
  const handleSave = () => {
    console.log('Saving music sheet content:', editableContent);
    onSaveContent(editableContent, false);
    setIsEditing(false);
    toast.success('Music sheet saved!');
  };
  
  return (
    <div className="flex flex-col w-full h-full">
      <div className="bg-muted/40 p-4 flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{metadata?.title || 'Untitled'}</h2>
        <div className="flex text-sm text-muted-foreground gap-4">
          <div>Composer: {metadata?.composer || 'Unknown'}</div>
          <div>Time: {metadata?.timeSignature || '4/4'}</div>
          <div>Key: {metadata?.keySignature || 'C'}</div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {isEditing ? (
          <div className="flex flex-col h-full">
            <textarea
              className="w-full h-full min-h-[300px] p-2 border rounded font-mono"
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              placeholder="Enter music sheet data in ABC notation format..."
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                className="px-3 py-1 bg-muted rounded"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-primary text-primary-foreground rounded"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full">
            {/* This div will contain the rendered music notation */}
            <div className="music-notation-container">
              {!content ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No music sheet content yet. Ask the AI to create one!
                </div>
              ) : (
                <MusicNotation key={`music-${currentVersionIndex}`} abcNotation={content} />
              )}
            </div>
            {isCurrentVersion && (
              <button
                className="mt-4 px-3 py-1 bg-muted rounded"
                onClick={() => setIsEditing(true)}
              >
                Edit Music Sheet
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const musicArtifact = new Artifact<'music', MusicSheetMetadata>({
  kind: 'music',
  description: 'Useful for creating and editing music sheets',
  initialize: async ({ setMetadata }) => {
    // Initialize with default metadata
    setMetadata({
      title: 'New Composition',
      composer: 'Anonymous',
      timeSignature: '4/4',
      keySignature: 'C',
    });
  },
  onStreamPart: ({ streamPart, setArtifact, setMetadata }) => {
    // Handle specific music content type using specific check
    if (typeof streamPart.type === 'string' && streamPart.type.includes('music-content')) {
      setArtifact((draftArtifact) => ({
        ...draftArtifact,
        content: String(streamPart.content || ''),
        isVisible: true,
        status: 'streaming',
      }));
    }
    
    // Handle music metadata with a safer approach
    if (typeof streamPart.type === 'string' && streamPart.type.includes('music-metadata')) {
      try {
        const metadata = streamPart.content as any;
        if (metadata && typeof metadata === 'object') {
          const safeMetadata: Partial<MusicSheetMetadata> = {};
          
          if (typeof metadata.title === 'string') safeMetadata.title = metadata.title;
          if (typeof metadata.composer === 'string') safeMetadata.composer = metadata.composer;
          if (typeof metadata.timeSignature === 'string') safeMetadata.timeSignature = metadata.timeSignature;
          if (typeof metadata.keySignature === 'string') safeMetadata.keySignature = metadata.keySignature;
          
          setMetadata((currentMetadata) => ({
            ...currentMetadata,
            ...safeMetadata,
          }));
        }
      } catch (error) {
        console.error('Error parsing music metadata:', error);
      }
    }
  },
  content: (props) => <MusicContent {...props} />,
  actions: [
    {
      icon: <UndoIcon size={18} />,
      description: 'View Previous version',
      onClick: ({ handleVersionChange }) => {
        handleVersionChange('prev');
      },
      isDisabled: ({ currentVersionIndex }) => {
        if (currentVersionIndex === 0) {
          return true;
        }
        return false;
      },
    },
    {
      icon: <RedoIcon size={18} />,
      description: 'View Next version',
      onClick: ({ handleVersionChange }) => {
        handleVersionChange('next');
      },
      isDisabled: ({ isCurrentVersion }) => {
        if (isCurrentVersion) {
          return true;
        }
        return false;
      },
    },
    {
      icon: <PlayIcon size={18} />,
      description: 'Play music',
      onClick: ({ content }) => {
        toast.info('Music playback is not implemented yet');
      },
    },
    {
      icon: <CopyIcon />,
      description: 'Copy notation',
      onClick: ({ content }) => {
        navigator.clipboard.writeText(content || '');
        toast.success('Copied music notation to clipboard!');
      },
    },
  ],
  toolbar: [
    {
      description: 'Format and beautify music notation',
      icon: <SparklesIcon />,
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content: 'Can you please format and beautify my music notation?',
        });
      },
    },
  ],
}); 