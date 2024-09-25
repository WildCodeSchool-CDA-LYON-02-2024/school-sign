import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Lesson {
  name: string;
  dateStart: string;
  dateEnd: string;
  classId: number; // Make sure this is defined
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const lessons = await prisma.lesson.findMany();
      res.status(200).json(lessons);
    } catch (error) {
      console.error("Error retrieving lessons:", error);
      res.status(500).json({ error: "Failed to retrieve lessons" });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, dateStart, dateEnd, classId }: Lesson = req.body;

      console.log("Received data:", { name, dateStart, dateEnd, classId });

      // Validation
      if (!name || !dateStart || !dateEnd || classId === undefined) {
        return res.status(400).json({ error: "Fields 'name', 'dateStart', 'dateEnd', and 'classId' are required." });
      }

      const startDate = new Date(dateStart);
      const endDate = new Date(dateEnd);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format." });
      }
      if (startDate >= endDate) {
        return res.status(400).json({ error: "'dateStart' must be earlier than 'dateEnd'." });
      }

      // Create lesson with classId
      const newLesson = await prisma.lesson.create({
        data: {
          name,
          dateStart: startDate,
          dateEnd: endDate,
          classId,
        },
      });

      console.log("Lesson created:", newLesson);
      res.status(201).json(newLesson);
    } catch (error) {
      console.error("Error creating lesson:", error);
      res.status(500).json({ error: "Failed to create lesson" });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
