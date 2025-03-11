
import React from 'react';
import { PreviewData } from '@/utils/urlPreviewUtils';
import { Card } from '@/components/ui/card';
import { ExternalLink, Clock, Globe, FileImage, FileVideo, Info, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface DetailedPreviewProps {
  data: PreviewData;
}

const DetailedPreview: React.FC<DetailedPreviewProps> = ({ data }) => {
  const { url, title, description, image, favicon, siteName, type, contentType } = data;
  
  return (
    <Card className="preview-card overflow-hidden">
      <div className="p-5">
        <div className="flex items-start space-x-4">
          {image ? (
            <div className="w-24 h-24 flex-shrink-0 rounded overflow-hidden">
              <img 
                src={image} 
                alt={title || 'Preview'} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/600x400/eeeeee/cccccc?text=Image+Not+Available';
                }}
              />
            </div>
          ) : (
            <div className="w-24 h-24 flex-shrink-0 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              {type === 'website' && <Globe className="h-10 w-10 text-gray-400" />}
              {type === 'image' && <FileImage className="h-10 w-10 text-gray-400" />}
              {type === 'video' && <FileVideo className="h-10 w-10 text-gray-400" />}
              {(type !== 'website' && type !== 'image' && type !== 'video') && (
                <File className="h-10 w-10 text-gray-400" />
              )}
            </div>
          )}
          
          <div className="flex-grow">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {title || siteName || 'No title available'}
            </h3>
            
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {description}
              </p>
            )}
            
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              {favicon ? (
                <img src={favicon} alt="Site icon" className="h-4 w-4 object-contain" />
              ) : (
                <Globe className="h-4 w-4" />
              )}
              <span>{siteName || new URL(url).hostname}</span>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Globe className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">URL:</span>
              <span className="font-mono text-xs text-gray-600 dark:text-gray-400 truncate flex-grow">
                {url}
              </span>
            </div>
            
            <div className="flex items-start space-x-2 text-sm">
              <Info className="h-4 w-4 text-gray-500 mt-0.5" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Type:</span>
              <span className="text-gray-600 dark:text-gray-400">
                {type === 'unknown' ? 'Unknown' : type.charAt(0).toUpperCase() + type.slice(1)}
                {contentType && <span className="text-xs font-mono ml-1">({contentType})</span>}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Retrieved:</span>
              <span className="text-gray-600 dark:text-gray-400">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            variant="default" 
            onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Website
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DetailedPreview;
