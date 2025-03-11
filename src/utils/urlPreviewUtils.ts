
export interface PreviewData {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
  siteName?: string;
  type?: 'website' | 'image' | 'video' | 'article' | 'unknown';
  contentType?: string;
  isError?: boolean;
  errorMessage?: string;
}

export const fetchPreviewData = async (url: string): Promise<PreviewData> => {
  try {
    console.log('Fetching preview for URL:', url);
    
    // For a real application, you would typically have a backend service to handle this
    // to avoid CORS issues. Here's a simplified approach that relies on client-side fetching:
    
    // First, try a direct fetch to see if CORS allows it (many sites won't)
    const response = await fetch(url, { 
      method: 'GET',
      headers: { 'Accept': 'text/html' },
      mode: 'cors' 
    });
    
    // Simple content type check to determine the type of content
    const contentType = response.headers.get('Content-Type') || '';
    
    if (contentType.includes('image/')) {
      // It's an image
      return {
        url,
        title: getFileNameFromUrl(url),
        image: url,
        type: 'image',
        contentType
      };
    } else if (contentType.includes('video/')) {
      // It's a video
      return {
        url,
        title: getFileNameFromUrl(url),
        type: 'video',
        contentType
      };
    } else if (contentType.includes('text/html') || contentType.includes('application/xhtml+xml')) {
      // It's a website, try to extract metadata
      const html = await response.text();
      return extractMetadataFromHtml(url, html);
    } else {
      // Unknown type
      return {
        url,
        title: getFileNameFromUrl(url),
        type: 'unknown',
        contentType
      };
    }
  } catch (error) {
    console.error('Error fetching URL preview:', error);
    return {
      url,
      isError: true,
      errorMessage: 'Could not load preview. The site might have CORS restrictions or be unavailable.',
      type: 'unknown'
    };
  }
};

// Helper to get filename from URL path
const getFileNameFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const segments = pathname.split('/');
    const fileName = segments[segments.length - 1];
    return fileName || urlObj.hostname;
  } catch {
    return url;
  }
};

// Function to extract metadata from HTML content
const extractMetadataFromHtml = (url: string, html: string): PreviewData => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Helper to get content from meta tags
  const getMetaContent = (name: string, property: string = ''): string => {
    const metaName = doc.querySelector(`meta[name="${name}"]`);
    const metaProperty = doc.querySelector(`meta[property="${property}"]`);
    return (metaName?.getAttribute('content') || metaProperty?.getAttribute('content') || '').trim();
  };

  // Extract basic metadata
  const title = doc.querySelector('title')?.textContent || getMetaContent('title', 'og:title');
  const description = getMetaContent('description', 'og:description');
  const image = getMetaContent('image', 'og:image');
  const siteName = getMetaContent('site_name', 'og:site_name');
  const type = getMetaContent('type', 'og:type') as 'website' | 'article' | 'unknown';
  
  // Try to find favicon
  const faviconLink = doc.querySelector('link[rel="icon"]') || 
                      doc.querySelector('link[rel="shortcut icon"]');
  let favicon = faviconLink?.getAttribute('href') || '';
  
  // Fix relative URLs
  if (favicon && !favicon.startsWith('http')) {
    try {
      const urlObj = new URL(url);
      favicon = new URL(favicon, `${urlObj.protocol}//${urlObj.hostname}`).toString();
    } catch {
      favicon = '';
    }
  }
  
  return {
    url,
    title: title || new URL(url).hostname,
    description,
    image,
    favicon,
    siteName,
    type: type as 'website' | 'article' | 'unknown' || 'website',
    contentType: 'text/html'
  };
};

// Function to determine if a URL is likely an image
export const isImageUrl = (url: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

// Function to determine if a URL is likely a video
export const isVideoUrl = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
};
