import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { registerSchemaUser } from "@/lib/schemas/registerSchemaUser";
import { verifyToken } from "@/lib/jwt";

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

// Handle GET request - Retrieve all student or a single student by ID
async function handleGet(req: NextApiRequest, res: NextApiResponse) {

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
    if (role !== "SCHOOL") {
      return res.status(403).json({
        error: "Access denied. You do not have the required permissions.",
      });
    }

    // Récupérer toutes les classes associées à l'école à partir de schoolId
    const users = await prisma.user.findMany({
      where: {
        role: Role.TEACHER, // Filtrer par l'ID de l'école
      },
    });

    // Répondre avec la liste des classes trouvées
    res.status(200).json({ users });
  } catch (error: any) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}

// Handle POST request - Add a new teacher
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  // const { id } = req.query;

  try {
    // Valider les données d'entrée
    const data = registerSchemaUser.parse(req.body);
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Obtenir l'ID de l'école et la classe à partir du token
    const tokenCookie = req.cookies.session;
    if (!tokenCookie) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    const payload = await verifyToken(tokenCookie);

    const { schoolId } = payload;
    if (!payload) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    if (!schoolId) {
      return res.status(400).json({ error: "School ID" });
    }

    // Créer l'utilisateur et l'affecter à une école et à une classe
    const user = await prisma.user.create({
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: hashedPassword,
        school: { connect: { id: schoolId } },
        role: Role.TEACHER,
      },
    });

    res.status(201).json({ user });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
