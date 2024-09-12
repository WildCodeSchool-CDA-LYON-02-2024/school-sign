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
    case "PUT":
      return handlePut(req, res);
    // case "DELETE":
    //   return handleDelete(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

// Handle GET request - Retrieve all student or a single student by ID
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    // Handle classId from query
    const classIdQuery = req.query.classid;
    let classId: number | undefined = undefined;
console.log(classId, 'CLASSID');

if (typeof classIdQuery === "string") {
  classId = parseInt(classIdQuery, 10);
  if (isNaN(classId)) {
    return res.status(400).json({ error: "Invalid class ID format" });
  }
} else if (Array.isArray(classIdQuery)) {
  // If classIdQuery is an array, handle the first element
  classId = parseInt(classIdQuery[0], 10);
  if (isNaN(classId)) {
    return res.status(400).json({ error: "Invalid class ID format" });
  }
}

  try {
    // Extract token from cookies
    const tokenCookie = req.cookies.session;
    if (!tokenCookie) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    // Verify token and extract payload
    const payload = await verifyToken(tokenCookie);
    const schoolId = payload.schoolId;
    const role = payload.role;

    // Check if the schoolId is present in the token
    if (!schoolId) {
      return res.status(400).json({ error: "School ID missing from token" });
    }

    // Optionally, check for specific roles
    if (role !== "SCHOOL") {
      return res.status(403).json({
        error: "Access denied. You do not have the required permissions.",
      });
    }

    if (classId) {
      // Query by classId
      const users = await prisma.user.findMany({
        where: {
          classId: classId,
          role: Role.TEACHER,
        },
      });

      if (users.length === 0) {
        return res.status(404).json({ error: "No teachers found for the provided classId" });
      }

      return res.status(200).json({ users });
    } else {
      // Query all teachers if no classId is provided
      const users = await prisma.user.findMany({
        where: {
          role: Role.TEACHER,
          schoolId: schoolId, // Filter by schoolId if needed
        },
      });

      return res.status(200).json({ users });
    }
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

// Handle PUT request - Update an existing teacher
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const id = parseInt(req.query.id as string, 10); // Convert ID to an integer
  const { classId } = req.body;

  try {
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    if (typeof classId === 'undefined') {
      return res.status(400).json({ error: "classId is required" });
    }

    // Perform the update
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        classId: classId,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
