import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { classSchema } from "@/lib/schemas/classSchema"; // Assurez-vous que ce schéma est bien défini
import { verifyToken } from "@/lib/jwt"; // Assurez-vous que la fonction verifyToken est importée correctement

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      return handleGet(req, res);
    case "POST":
      return handlePost(req, res);
    // case "PUT":
    //   return handlePut(req, res);
    // case "DELETE":
    //   return handleDelete(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
// Handle POST request - Add a new class
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  // const { id } = req.query;

  try {
    // Extraire le token des cookies
    const tokenCookie = req.cookies.session;
    if (!tokenCookie) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    // Vérifier le token et extraire le payload
    const payload = await verifyToken(tokenCookie);
    const schoolId = payload.schoolId;
    if (!schoolId) {
      return res.status(400).json({ error: "School ID missing from token" });
    }

    // Valider les données d'entrée en utilisant le schéma
    const data = classSchema.parse(req.body);

    // Créer la classe avec l'école associée (en utilisant schoolId du token)
    const createdClass = await prisma.classsection.create({
      data: {
        name: data.name,
        school: { connect: { id: schoolId } }, // Utilisation de schoolId du token
      },
    });

    // Répondre avec la classe créée
    res.status(201).json({ class: createdClass });
  } catch (error: any) {
    // Gérer les erreurs de validation et autres exceptions
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.errors });
    }

    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}

// Handle GET request - Retrieve all student or a single student by ID
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  try {
    // Extraire le token des cookies
    const tokenCookie = req.cookies.session;
    if (!tokenCookie) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    // Vérifier le token et extraire le payload
    const payload = await verifyToken(tokenCookie);
    const schoolId = payload.schoolId;
    const role = payload.role;

    // Vérification que l'utilisateur a bien un schoolId
    if (!schoolId) {
      return res.status(400).json({ error: "School ID missing from token" });
    }

    // Optionnel : Si vous souhaitez limiter l'accès à certains rôles, ajoutez une vérification du rôle ici.
    if (role !== "SCHOOL" && role !== "TEACHER") {
      return res
        .status(403)
        .json({
          error: "Access denied. You do not have the required permissions.",
        });
    }

    // Récupérer toutes les classes associées à l'école à partir de schoolId
    const classSections = await prisma.classsection.findMany({
      where: {
        schoolId: schoolId, // Filtrer par l'ID de l'école
      },
      include: {
        users: true, // Optionnel : inclure les utilisateurs de la classe si nécessaire
      },
    });

    // Répondre avec la liste des classes trouvées
    res.status(200).json({ classSections });
  } catch (error: any) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
