import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const packet_index = formData.get('packet_index') as string | null;
    const uuid = formData.get('uuid') as string | null;
    const total = formData.get('total') as string | null;

    console.log('Form Data:', { packet_index, uuid, total });

    if (!uuid) {
        return NextResponse.json({ message: 'UUID is required' }, { status: 400 });
    }
    const file = formData.get('file') as File;

    if (!file) {
        return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'uploads', uuid);
    const packetPath = path.join(uploadDir, `packet_${packet_index}`);

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.writeFile(packetPath, buffer);
        return NextResponse.json({ message: 'Packet uploaded', packet_index, uuid, total });
    } catch (error) {
console.error('Error uploading packet:', error);
        return NextResponse.json({ message: 'Failed to upload packet', error }, { status: 500 });
    }
}
