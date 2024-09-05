import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { registerSchemaUser } from "@/lib/schemas/registerSchemaUser";
import { verifyToken } from "@/lib/jwt"; 

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // Valider les données d'entrée
      const data = registerSchemaUser.parse(req.body);
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Obtenir l'ID de l'école à partir du token (ou d'une autre source)
      const tokenCookie = req.cookies.session;
      if (!tokenCookie) {
        return res.status(401).json({ error: "Authorization token required" });
      }

      const payload = await verifyToken(tokenCookie);
      const schoolId = payload.schoolId;
      if (!schoolId) {
        return res.status(400).json({ error: "School ID missing from token" });
      }

      // Vérifier que l'ID de la classe est valide
      const classSection = await prisma.classsection.findUnique({
        where: { id: data.classId },
      });

      if (!classSection) {
        return res.status(400).json({ error: "Invalid class ID" });
      }

      // Créer l'utilisateur et l'affecter à une école et à une classe
      const user = await prisma.user.create({
        data: {
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          password: hashedPassword,
          class: { connect: { id: data.classId } },
          school: { connect: { id: schoolId } }, 
          role: Role.STUDENT,
        },
      });

      res.status(201).json({ user });
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
