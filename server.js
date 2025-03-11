
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoint to fetch URL previews
app.get('/api/preview', async (req, res) => {
  const targetUrl = req.query.url;
  
  if (!targetUrl) {
    return res.status(400).json({ 
      isError: true, 
      errorMessage: 'URL parameter is required' 
    });
  }
  
  try {
    console.log(`Server fetching: ${targetUrl}`);
    
    // Check if it's an image URL
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    const isImage = imageExtensions.some(ext => targetUrl.toLowerCase().endsWith(ext));
    
    // Check if it's a video URL
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    const isVideo = videoExtensions.some(ext => targetUrl.toLowerCase().endsWith(ext));
    
    if (isImage) {
      return res.json({
        url: targetUrl,
        title: getFileNameFromUrl(targetUrl),
        image: targetUrl,
        type: 'image',
        contentType: 'image/*'
      });
    }
    
    if (isVideo) {
      return res.json({
        url: targetUrl,
        title: getFileNameFromUrl(targetUrl),
        type: 'video',
        contentType: 'video/*'
      });
    }
    
    // For websites, fetch and extract metadata
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PreviewBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml'
      },
      timeout: 5000
    });
    
    const contentType = response.headers['content-type'] || '';
    
    if (contentType.includes('image/')) {
      return res.json({
        url: targetUrl,
        title: getFileNameFromUrl(targetUrl),
        image: targetUrl,
        type: 'image',
        contentType
      });
    } else if (contentType.includes('video/')) {
      return res.json({
        url: targetUrl,
        title: getFileNameFromUrl(targetUrl),
        type: 'video',
        contentType
      });
    } else if (contentType.includes('text/html') || contentType.includes('application/xhtml+xml')) {
      const html = response.data;
      const previewData = extractMetadataFromHtml(targetUrl, html);
      return res.json(previewData);
    } else {
      return res.json({
        url: targetUrl,
        title: getFileNameFromUrl(targetUrl),
        type: 'unknown',
        contentType
      });
    }
  } catch (error) {
    console.error('Error fetching URL:', error.message);
    return res.status(500).json({
      url: targetUrl,
      isError: true,
      errorMessage: `Failed to fetch URL: ${error.message}`,
      type: 'unknown'
    });
  }
});

// Helper function to extract metadata from HTML
function extractMetadataFromHtml(url, html) {
  const $ = cheerio.load(html);
  
  // Helper to get content from meta tags
  const getMetaContent = (name, property = '') => {
    let content = $(`meta[name="${name}"]`).attr('content') || 
                  $(`meta[property="${property}"]`).attr('content') || '';
    return content.trim();
  };

  // Extract basic metadata
  const title = $('title').text() || getMetaContent('title', 'og:title');
  const description = getMetaContent('description', 'og:description');
  const image = getMetaContent('image', 'og:image');
  const siteName = getMetaContent('site_name', 'og:site_name');
  const type = getMetaContent('type', 'og:type') || 'website';
  
  // Try to find favicon
  let favicon = $('link[rel="icon"]').attr('href') || 
                $('link[rel="shortcut icon"]').attr('href') || '';
  
  // Fix relative URLs
  if (favicon && !favicon.startsWith('http')) {
    try {
      const parsedUrl = new URL(url);
      favicon = new URL(favicon, `${parsedUrl.protocol}//${parsedUrl.hostname}`).toString();
    } catch {
      favicon = '';
    }
  }
  
  if (image && !image.startsWith('http')) {
    try {
      const parsedUrl = new URL(url);
      image = new URL(image, `${parsedUrl.protocol}//${parsedUrl.hostname}`).toString();
    } catch {
      // Keep the original value if parsing fails
    }
  }
  
  return {
    url,
    title: title || new URL(url).hostname,
    description,
    image,
    favicon,
    siteName,
    type: type || 'website',
    contentType: 'text/html'
  };
}

// Helper to get filename from URL path
function getFileNameFromUrl(urlString) {
  try {
    const parsedUrl = new URL(urlString);
    const pathname = parsedUrl.pathname;
    const segments = pathname.split('/');
    const fileName = segments[segments.length - 1];
    return fileName || parsedUrl.hostname;
  } catch {
    return urlString;
  }
}

// Catch-all handler for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
