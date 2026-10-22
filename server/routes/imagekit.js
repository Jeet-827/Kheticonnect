import express from 'express';
import { getImageKit, isImageKitConfigured } from '../config/imagekit.js';

const router = express.Router();

// GET /api/imagekit/auth - Get authentication parameters for direct client upload
router.get('/auth', (req, res) => {
  try {
    const ik = getImageKit();
    if (!ik) {
      return res.json({
        configured: false,
        message: 'ImageKit credentials not configured in environment variables (IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT).'
      });
    }

    const authParams = ik.getAuthenticationParameters();
    res.json({
      configured: true,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      ...authParams
    });
  } catch (err) {
    console.error('[ImageKit Auth Error]', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/imagekit/upload - Upload crop image to ImageKit CDN
router.post('/upload', async (req, res) => {
  try {
    const { file, fileName, tags = ['crop', 'kheticonnect'], folder = '/crops' } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided. Please provide a base64 string, file data, or image URL.'
      });
    }

    const ik = getImageKit();

    // If ImageKit API keys are configured, upload to ImageKit CDN
    if (ik) {
      const uploadResponse = await ik.upload({
        file, // Accepts base64, URL, or buffer
        fileName: fileName || `crop_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`,
        folder,
        tags: Array.isArray(tags) ? tags : [tags],
        useUniqueFileName: true
      });

      return res.status(200).json({
        success: true,
        source: 'imagekit',
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
        name: uploadResponse.name,
        thumbnailUrl: uploadResponse.thumbnailUrl || uploadResponse.url,
        width: uploadResponse.width,
        height: uploadResponse.height,
        size: uploadResponse.size,
        message: 'Image uploaded to ImageKit successfully'
      });
    }

    // Dev Fallback when keys are not configured yet
    console.warn('[ImageKit] Keys not configured in .env. Falling back to local data/url payload.');

    // If file is already a base64 or external url, return it directly
    const fallbackUrl = file;
    res.status(200).json({
      success: true,
      source: 'local-fallback',
      url: fallbackUrl,
      fileId: `local_${Date.now()}`,
      name: fileName || 'crop_image.jpg',
      thumbnailUrl: fallbackUrl,
      message: 'Image processed successfully (ImageKit keys not yet configured in server/.env)'
    });
  } catch (err) {
    console.error('[ImageKit Upload Error]', err);
    res.status(500).json({
      success: false,
      message: err.message || 'ImageKit upload failed'
    });
  }
});

export default router;
