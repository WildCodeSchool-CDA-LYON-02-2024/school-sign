import type { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'fs';
import * as path from 'path';
import { Buffer } from 'buffer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { dataUrl } = req.body;

      if (!dataUrl || !dataUrl.startsWith('data:image/png;base64,')) {
        return res.status(400).json({ error: 'Invalid data URL' });
      }

      const base64Data = dataUrl.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');

      const filePath = path.join(process.cwd(), 'public', 'signature.png');
      fs.writeFileSync(filePath, buffer);

      res.status(200).json({ message: 'Image successfully saved as signature.png' });
    } catch (error) {
      console.error('Error saving image:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
