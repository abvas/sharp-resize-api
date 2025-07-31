import sharp from 'sharp';
import fetch from 'node-fetch';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    const { imageUrl, width, height, format = 'webp' } = await req.json();

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: 'imageUrl is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(imageUrl);
    const buffer = Buffer.from(await response.arrayBuffer());

    const image = sharp(buffer).resize(width || null, height || null).toFormat(format);
    const output = await image.toBuffer();

    const base64 = `data:image/${format};base64,` + output.toString('base64');

    return new Response(JSON.stringify({
      base64,
      extension: format,
      contentType: `image/${format}`,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}