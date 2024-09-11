import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import { DocumentSchema } from "@/lib/schemas/document.schema";
import { PrismaClient } from "@prisma/client";
import { promisify } from "util";

// Extend NextApiRequest to include file property
interface NextApiRequestWithFile extends NextApiRequest {
  file?: Express.Multer.File;
}

const prisma = new PrismaClient();

// Configure multer storage
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const uploadMiddleware = promisify(upload.single("file"));

export default async function handler(
  req: NextApiRequestWithFile,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      await uploadMiddleware(req as any, res as any);

      const file = req.file;
      if (!file) {
        console.error("File is required");
        return res.status(400).json({ error: "File is required" });
      }

      const documentData = {
        name: file.originalname,
        url: `/uploads/${file.filename}`,
      };

      const parsedData = DocumentSchema.safeParse(documentData);
      if (!parsedData.success) {
        console.error("Validation error:", parsedData.error.errors);
        return res.status(400).json({ error: parsedData.error.errors });
      }

      // Save the document data to the database
      const document = await prisma.document.create({
        data: parsedData.data,
      });

      res
        .status(200)
        .json({ message: "File uploaded successfully", data: document });
    } catch (error) {
      console.error("Internal server error:", error);
      res.status(500).json({ error: "Internal server error" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
