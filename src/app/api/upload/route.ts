import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { Readable } from 'stream';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('file') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const driveFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (!driveFolderId || !serviceAccountKey) {
      return NextResponse.json(
        { error: 'Server configuration missing (Folder ID or Service Account Key)' },
        { status: 500 }
      );
    }

    let credentials;
    try {
      credentials = JSON.parse(serviceAccountKey);
      if (credentials.private_key) {
        // Fix for Vercel stripping newlines
        credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
      }
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid Google Credentials JSON format' },
        { status: 500 }
      );
    }

    // Initialize JWT directly
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });
    const uploadedFiles = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);

      const fileMetadata = {
        name: `${Date.now()}-${file.name}`,
        parents: [driveFolderId],
      };

      const media = {
        mimeType: file.type,
        body: stream,
      };

      const response = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, name',
      });

      uploadedFiles.push(response.data);
    }

    return NextResponse.json({ success: true, files: uploadedFiles });
  } catch (error: any) {
    console.error('Final Debug Error:', error);
    return NextResponse.json(
      { 
        error: 'Upload failed', 
        details: error.message,
        hint: 'Check if DRIVE_PRIVATE_KEY is correctly pasted with BEGIN/END markers'
      },
      { status: 500 }
    );
  }
}
