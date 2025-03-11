
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import URLInput from '@/components/URLInput';
import PreviewCard from '@/components/PreviewCard';
import CompactPreview from '@/components/CompactPreview';
import DetailedPreview from '@/components/DetailedPreview';
import LoadingState from '@/components/LoadingState';
import ErrorDisplay from '@/components/ErrorDisplay';
import { PreviewData } from '@/utils/urlPreviewUtils';
import { fetchUrlPreview } from '@/utils/previewService';
import { Info } from 'lucide-react';

const Index = () => {
  const [url, setUrl] = useState<string>('');
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('card');

  const generatePreview = async (inputUrl: string) => {
    setUrl(inputUrl);
    setIsLoading(true);
    setPreviewData(null);
    
    try {
      // Use the server-side proxy instead of direct fetch
      const data = await fetchUrlPreview(inputUrl);
      setPreviewData(data);
    } catch (error) {
      console.error('Error generating preview:', error);
      setPreviewData({
        url: inputUrl,
        isError: true,
        errorMessage: 'Failed to generate preview. Please check the URL and try again.',
        type: 'unknown'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            URL Preview
          </h1>
          <p className="text-white/80 text-lg">
            Enter any URL to generate rich previews
          </p>
        </header>

        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 mb-8">
          <URLInput onSubmit={generatePreview} isLoading={isLoading} />
        </div>

        {!url && !previewData && !isLoading && (
          <div className="preview-card p-6 text-center flex flex-col items-center">
            <Info className="h-10 w-10 text-purple-500 mb-4" />
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter a URL to get started
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Try with a website, image, or video URL to see different preview types
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                https://example.com
              </div>
              <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                https://images.unsplash.com/...
              </div>
              <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                https://youtube.com/watch?v=...
              </div>
            </div>
          </div>
        )}

        {url && !previewData && isLoading && (
          <LoadingState url={url} />
        )}

        {previewData && previewData.isError && (
          <ErrorDisplay 
            url={url} 
            message={previewData.errorMessage || 'Unknown error'} 
            onRetry={() => generatePreview(url)}
          />
        )}

        {previewData && !previewData.isError && (
          <div>
            <Tabs 
              defaultValue="card" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 inline-flex">
                <TabsList className="bg-transparent">
                  <TabsTrigger 
                    value="card"
                    className={`preview-tab ${activeTab === 'card' ? 'active' : ''}`}
                  >
                    Card
                  </TabsTrigger>
                  <TabsTrigger 
                    value="compact"
                    className={`preview-tab ${activeTab === 'compact' ? 'active' : ''}`}
                  >
                    Compact
                  </TabsTrigger>
                  <TabsTrigger 
                    value="detailed"
                    className={`preview-tab ${activeTab === 'detailed' ? 'active' : ''}`}
                  >
                    Detailed
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="card" className="mt-4">
                <PreviewCard data={previewData} />
              </TabsContent>
              
              <TabsContent value="compact" className="mt-4">
                <CompactPreview data={previewData} />
              </TabsContent>
              
              <TabsContent value="detailed" className="mt-4">
                <DetailedPreview data={previewData} />
              </TabsContent>
            </Tabs>
          </div>
        )}

        <footer className="mt-12 text-center text-white/60 text-sm">
          <p>
            Enter any URL to see multiple preview formats
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
