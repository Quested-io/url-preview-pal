
import React from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface ErrorDisplayProps {
  url: string;
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ url, message, onRetry }) => {
  const { toast } = useToast();
  
  const handleCopyExplanation = () => {
    const explanation = "Most websites have CORS (Cross-Origin Resource Sharing) restrictions that prevent client-side JavaScript from directly accessing their content. A server-side API would be required to properly generate previews.";
    navigator.clipboard.writeText(explanation)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Explanation copied to clipboard",
          duration: 3000,
        });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };
  
  return (
    <Alert variant="destructive" className="preview-card">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="ml-2">Error Previewing URL</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">
          We couldn't generate a preview for: <span className="font-mono text-xs break-all">{url}</span>
        </p>
        <p className="mb-3">{message}</p>
        
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md mb-3">
          <div className="flex items-center mb-2">
            <Info className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm font-medium">Why is this happening?</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Most websites have CORS restrictions that prevent direct access from browsers. 
            A backend service would be needed to properly generate previews.
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 text-xs"
            onClick={handleCopyExplanation}
          >
            Copy explanation
          </Button>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorDisplay;
