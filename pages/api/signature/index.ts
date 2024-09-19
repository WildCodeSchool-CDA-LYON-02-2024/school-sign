import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { verifyToken } from "@/lib/jwt";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "POST":
      return handlePost(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { dataUrl } = req.body;
    const tokenCookie = req.cookies.session;

    if (!tokenCookie) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    const payload = await verifyToken(tokenCookie);
    const userId = payload.userId;
    const firstname = payload.firstname ?? "unknown";
    const lastname = payload.lastname ?? "unknown";

    if (!dataUrl || !dataUrl.startsWith("data:image/png;base64,")) {
      return res.status(400).json({ error: "Invalid data URL" });
    }

    const base64Data = dataUrl.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");

    const directoryPath = path.join(process.cwd(), "public", "signatures");

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    const fileName = `signature-${firstname}-${lastname}-${Date.now()}.png`;
    const filePath = path.join(directoryPath, fileName);

    fs.writeFileSync(filePath, buffer);

    const publicFilePath = `/signatures/${fileName}`;

    const sign = await prisma.sign.create({
      data: {
        hashedSign: publicFilePath,
        userId: userId,
        date: new Date(),
      },
    });

    res.status(200).json({
      sign,
      message: "Image successfully saved",
      filePath: `/signatures/${fileName}`,
    });
  } catch (error) {
    console.error("Error saving image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
