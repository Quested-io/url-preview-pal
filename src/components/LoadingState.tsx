
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  url: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ url }) => {
  return (
    <Card className="preview-card">
      <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin text-purple-500">
          <Loader2 className="h-10 w-10" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Generating preview...
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
          <p>Fetching data from:</p>
          <code className="font-mono text-xs break-all bg-gray-100 dark:bg-gray-800 p-1 rounded">
            {url}
          </code>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
