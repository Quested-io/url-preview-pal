
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface URLInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const URLInput: React.FC<URLInputProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple URL validation
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to preview",
        variant: "destructive",
      });
      return;
    }

    // Add https:// if protocol is missing
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      formattedUrl = `https://${url}`;
    }
    
    onSubmit(formattedUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-2">
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Enter a URL (e.g., https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="url-input w-full pl-4 pr-10 py-2 h-12 rounded-lg"
          disabled={isLoading}
        />
      </div>
      <Button 
        type="submit"
        disabled={isLoading}
        className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-6 rounded-lg transition-colors duration-300"
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </span>
        ) : (
          <span className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            Preview
          </span>
        )}
      </Button>
    </form>
  );
};

export default URLInput;
