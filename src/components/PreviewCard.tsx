
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ExternalLink, Globe, FileImage, FileVideo, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PreviewData } from '@/utils/urlPreviewUtils';

interface PreviewCardProps {
  data: PreviewData;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ data }) => {
  const { url, title, description, image, favicon, siteName, type } = data;
  
  const renderIcon = () => {
    switch (type) {
      case 'image':
        return <FileImage className="h-5 w-5 text-blue-500" />;
      case 'video':
        return <FileVideo className="h-5 w-5 text-red-500" />;
      case 'website':
      case 'article':
        return favicon ? (
          <img src={favicon} alt="Site icon" className="h-5 w-5 object-contain" />
        ) : (
          <Globe className="h-5 w-5 text-gray-500" />
        );
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className="preview-card overflow-hidden">
      {type === 'image' ? (
        <div className="w-full h-56 relative">
          <img 
            src={image || url} 
            alt={title || 'Image preview'} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/600x400/eeeeee/cccccc?text=Image+Not+Available';
            }}
          />
        </div>
      ) : image ? (
        <div className="w-full h-40 relative">
          <img 
            src={image} 
            alt={title || siteName || 'Preview'} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/600x400/eeeeee/cccccc?text=Image+Not+Available';
            }}
          />
        </div>
      ) : (
        <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
          {type === 'website' && <Globe className="h-16 w-16 text-gray-400 dark:text-gray-500" />}
          {type === 'video' && <FileVideo className="h-16 w-16 text-gray-400 dark:text-gray-500" />}
          {(type !== 'website' && type !== 'video') && <File className="h-16 w-16 text-gray-400 dark:text-gray-500" />}
        </div>
      )}
      
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          {renderIcon()}
          <div className="text-xs font-mono text-gray-500 dark:text-gray-400 truncate flex-grow">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>{url}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{url}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2">
          {title || siteName || 'No title available'}
        </h3>
        
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-2">
            {description}
          </p>
        )}
        
        {siteName && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {siteName}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Visit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PreviewCard;
