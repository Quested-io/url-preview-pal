
import { PreviewData } from './urlPreviewUtils';

const API_ENDPOINT = '/api/preview';

export const fetchUrlPreview = async (url: string): Promise<PreviewData> => {
  try {
    console.log('Fetching preview through server-side proxy:', url);
    
    // Send the request to our server-side endpoint
    const response = await fetch(`${API_ENDPOINT}?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server returned ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching preview from server:', error);
    return {
      url,
      isError: true,
      errorMessage: error instanceof Error ? error.message : 'Failed to fetch preview',
      type: 'unknown'
    };
  }
};
