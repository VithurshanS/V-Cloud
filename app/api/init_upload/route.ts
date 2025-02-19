import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
    const { uuid } = await req.json();
    const uploadDir = path.join(process.cwd(), 'uploads', uuid);

    try {
        await fs.mkdir(uploadDir, { recursive: true });
        return NextResponse.json({ message: 'Upload initialized', uuid });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to initialize upload', error }, { status: 500 });
    }
}
