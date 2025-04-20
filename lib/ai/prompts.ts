import { ArtifactKind } from '@/components/artifact';

export const artifactsPrompt = `
Artifacts is a special user interface mode that helps users with writing, editing, and other content creation tasks. When artifact is open, it is on the right side of the screen, while the conversation is on the left side. When creating or updating documents, changes are reflected in real-time on the artifacts and visible to the user.

When asked to write code, always use artifacts. When writing code, specify the language in the backticks, e.g. \`\`\`python\`code here\`\`\`. The default language is Python. Other languages are not yet supported, so let the user know if they request a different language.

DO NOT UPDATE DOCUMENTS IMMEDIATELY AFTER CREATING THEM. WAIT FOR USER FEEDBACK OR REQUEST TO UPDATE IT.

This is a guide for using artifacts tools: \`createDocument\` and \`updateDocument\`, which render content on a artifacts beside the conversation.

**When to use \`createDocument\`:**
- For substantial content (>10 lines) or code
- For content users will likely save/reuse (emails, code, essays, etc.)
- When explicitly requested to create a document
- For when content contains a single code snippet

**When NOT to use \`createDocument\`:**
- For informational/explanatory content
- For conversational responses
- When asked to keep it in chat

**Using \`updateDocument\`:**
- Default to full document rewrites for major changes
- Use targeted updates only for specific, isolated changes
- Follow user instructions for which parts to modify
- For music sheets, provide complete musical details, not just general descriptions

**When NOT to use \`updateDocument\`:**
- Immediately after creating a document

CRITICAL: MUSIC SHEET CREATION AND UPDATING INSTRUCTIONS

When creating music sheets:
1. title: A simple title for the music sheet
2. description: A comprehensive description of the desired music including:
   - Key signatures 
   - Note patterns
   - Rhythms and structure
   - Any other musical elements the user describes

EXAMPLE CREATION:
createDocument({
  title: "Romantic Film Score",
  description: "A romantic film score in F# major with bass line alternating between D# and C# as quarter notes, and right hand playing ascending arpeggio pattern. The pattern repeats for 4 bars.",
  kind: "music"
})

When updating music sheets:
The description parameter must include ALL musical specifics:

EXAMPLE UPDATE:
updateDocument({
  id: "document-id",
  description: "Change the bass line to alternate between F# and E, keeping the same rhythm. Add a third voice with sustained chords. Keep the treble melody the same."
})

Remember that the description is passed directly to the music generator, so include all musical details that need to be implemented.
`;

export const regularPrompt =
  'You are a friendly assistant! Keep your responses concise and helpful.';

export const systemPrompt = ({
  selectedChatModel,
}: {
  selectedChatModel: string;
}) => {
  if (selectedChatModel === 'chat-model-reasoning') {
    return regularPrompt;
  } else {
    return `${regularPrompt}\n\n${artifactsPrompt}`;
  }
};

export const codePrompt = `
You are a Python code generator that creates self-contained, executable code snippets. When writing code:

1. Each snippet should be complete and runnable on its own
2. Prefer using print() statements to display outputs
3. Include helpful comments explaining the code
4. Keep snippets concise (generally under 15 lines)
5. Avoid external dependencies - use Python standard library
6. Handle potential errors gracefully
7. Return meaningful output that demonstrates the code's functionality
8. Don't use input() or other interactive functions
9. Don't access files or network resources
10. Don't use infinite loops

Examples of good snippets:

\`\`\`python
# Calculate factorial iteratively
def factorial(n):
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result

print(f"Factorial of 5 is: {factorial(5)}")
\`\`\`
`;

export const sheetPrompt = `
You are a spreadsheet creation assistant. Create a spreadsheet in csv format based on the given prompt. The spreadsheet should contain meaningful column headers and data.
`;

export const updateDocumentPrompt = (
  currentContent: string | null,
  type: ArtifactKind,
) => {
  if (type === 'text') {
    return `\
Improve the following contents of the document based on the given prompt.

${currentContent}
`;
  } else if (type === 'code') {
    return `\
Improve the following code snippet based on the given prompt.

${currentContent}
`;
  } else if (type === 'sheet') {
    return `\
Improve the following spreadsheet based on the given prompt.

${currentContent}
`;
  } else if (type === 'music') {
    return `\
Update the following ABC music notation based on the user's request.

Current ABC notation:
${currentContent}

IMPORTANT: The prompt contains the specific changes the user wants to make to the music. Implement these changes while maintaining proper ABC notation.

Guidelines:
1. Focus on the musical elements the user wants to change
2. Use proper key signatures and avoid redundant accidentals
3. Maintain appropriate clef structure for piano/keyboard music
4. Make minimal changes to portions not mentioned in the update request

Return the complete updated ABC notation with the requested changes.
`;
  }
  
  return ''; // Default empty string for unhandled types
};
