import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const lessons = await prisma.lesson.findMany();
      res.status(200).json(lessons);
    } catch (error) {
      console.error("Erreur lors de la récupération des leçons :", error);
      res.status(500).json({ error: "Erreur lors de la récupération des leçons" });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, dateStart, dateEnd } = req.body;

      console.log("Données reçues :", { name, dateStart, dateEnd });

      if (!name || !dateStart || !dateEnd) {
        return res.status(400).json({ error: "Les champs 'name', 'dateStart' et 'dateEnd' sont requis." });
      }

      const newLesson = await prisma.lesson.create({
        data: {
          name,
          dateStart: new Date(dateStart),
          dateEnd: new Date(dateEnd),
        },
      });

      console.log("Leçon créée :", newLesson);

      res.status(201).json(newLesson);
    } catch (error) {
      console.error("Erreur lors de la création de la leçon :", error);
      res.status(500).json({ error: "Erreur lors de la création de la leçon" });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
