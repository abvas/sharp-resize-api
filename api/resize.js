import sharp from 'sharp';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { imageUrl, width, height, format } = req.body;

    if (!imageUrl || !width || !height || !format) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const response = await fetch(imageUrl);
    if (!response.ok) {
      return res.status(400).json({ error: 'Failed to fetch image' });
    }

    const imageBuffer = await response.buffer();

    const outputBuffer = await sharp(imageBuffer)
      .resize(Number(width), Number(height))
      .toFormat(format)
      .toBuffer();

    const base64 = `data:image/${format};base64,${outputBuffer.toString('base64')}`;

    res.status(200).json({ base64 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Image processing failed' });
  }
}
