import { TestNotation } from '@/components/test-notation';

export default function TestNotationPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Music Notation Rendering Test</h1>
      <p className="mb-6">
        This page demonstrates the rendering of ABC notation using the ABCJS library.
        It follows the paradigmatic implementation shown in the ABCJS documentation.
      </p>
      
      <TestNotation />
    </div>
  );
} 