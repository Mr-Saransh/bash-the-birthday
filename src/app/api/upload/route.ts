import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary from environment
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
  });
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';

    let imagePayload: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 });
      }

      // Convert File to base64 data URI
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = file.type || 'image/jpeg';
      imagePayload = `data:${mimeType};base64,${buffer.toString('base64')}`;
    } else {
      const json = await req.json();
      imagePayload = json.image || json.dataUri || json.file;
    }

    if (!imagePayload) {
      return NextResponse.json({ error: 'No image data received' }, { status: 400 });
    }

    // Upload with automatic mobile performance optimizations
    const result = await cloudinary.uploader.upload(imagePayload, {
      folder: 'bash-the-birthday',
      resource_type: 'image',
      transformation: [
        {
          width: 1200,
          height: 1200,
          crop: 'limit',
          quality: 'auto:good',
          fetch_format: 'auto',
        },
      ],
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    console.error('Cloudinary upload API error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
