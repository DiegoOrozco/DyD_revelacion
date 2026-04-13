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
        { error: 'Server configuration missing (Drive Folder ID or Service Account Key)' },
        { status: 500 }
      );
    }

    // Parse and fix Service Account Key
    let credentials;
    try {
      credentials = JSON.parse(serviceAccountKey);
      if (credentials.private_key) {
        // Fix for common newline issues when pasting keys into hosting providers
        credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
      }
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid Service Account JSON format' },
        { status: 500 }
      );
    }

    // Initialize Google Auth
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive'], // Broadened scope to allow writing to shared folders
    });

    const drive = google.drive({ version: 'v3', auth });
    const uploadedFiles = [];

    for (const file of files) {
      // Convert File to Buffer then to Stream
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

    return NextResponse.json({ 
      success: true, 
      files: uploadedFiles 
    });
  } catch (error: any) {
    console.error('Detailed Google Drive Error:', error);
    
    // Capturamos el mensaje exacto que devuelve Google en su respuesta interna
    const googleErrorMessage = error.response?.data?.error?.message 
      || error.errors?.[0]?.message 
      || error.message;

    return NextResponse.json(
      { 
        error: 'Upload failed', 
        details: googleErrorMessage,
        code: error.code || 500,
        fullError: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
