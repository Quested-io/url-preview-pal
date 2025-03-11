
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  url: string;
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ url, message, onRetry }) => {
  return (
    <Alert variant="destructive" className="preview-card">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="ml-2">Error Previewing URL</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">
          We couldn't generate a preview for: <span className="font-mono text-xs break-all">{url}</span>
        </p>
        <p className="mb-3">{message}</p>
        <div className="flex justify-end">
          <Button variant="outline" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorDisplay;
