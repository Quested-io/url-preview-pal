
import React from 'react';
import { PreviewData } from '@/utils/urlPreviewUtils';
import { ExternalLink, Globe, FileImage, FileVideo, File } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompactPreviewProps {
  data: PreviewData;
}

const CompactPreview: React.FC<CompactPreviewProps> = ({ data }) => {
  const { url, title, favicon, siteName, type } = data;
  
  const renderIcon = () => {
    switch (type) {
      case 'image':
        return <FileImage className="h-5 w-5 flex-shrink-0 text-blue-500" />;
      case 'video':
        return <FileVideo className="h-5 w-5 flex-shrink-0 text-red-500" />;
      case 'website':
      case 'article':
        return favicon ? (
          <img src={favicon} alt="Site icon" className="h-5 w-5 flex-shrink-0 object-contain" />
        ) : (
          <Globe className="h-5 w-5 flex-shrink-0 text-gray-500" />
        );
      default:
        return <File className="h-5 w-5 flex-shrink-0 text-gray-500" />;
    }
  };

  return (
    <div className="preview-card p-3 flex items-center space-x-3">
      {renderIcon()}
      
      <div className="flex-grow min-w-0">
        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
          {title || siteName || new URL(url).hostname}
        </h3>
        
        <div className="text-xs font-mono text-gray-500 dark:text-gray-400 truncate">
          {url}
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex-shrink-0"
        onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CompactPreview;
