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
// Handle POST request - Add a new student
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
    if (!schoolId || !data.classId) {
      return res
        .status(400)
        .json({ error: "School ID or Class ID missing from token" });
    }

    // Vérifier que la classe est valide
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
}

// Handle GET request - Retrieve all student or a single student by ID
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const tokenCookie = req.cookies.session;
    if (!tokenCookie) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    // Verify the token and extract the payload
    const payload = await verifyToken(tokenCookie);
    const { schoolId, classId, role } = payload;

    if (!schoolId) {
      return res.status(400).json({ error: "School ID missing from token" });
    }

    // Optionally restrict access to certain roles
    if (role !== "SCHOOL") {
      return res.status(403).json({ error: "Access denied. You do not have the required permissions." });
    }

    // Fetch a single student by ID if `id` is provided
    if (id) {
      const userId = Number(id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID format" });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ user });
    }

    // Fetch all students if `id` is not provided
    const users = await prisma.user.findMany({
      where: {
        schoolId,
        classId,
      },
    });

    return res.status(200).json({ users });
  } catch (error: any) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}

// import type { NextApiRequest, NextApiResponse } from "next";
// import prisma from "@/lib/prisma";
// import { z } from "zod";

// const bookSchema = z.object({
//   title: z.string().min(1),
//   author: z.string().min(1),
//   description: z.string().min(1),
// });

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { method } = req;

//   switch (method) {
//     case "GET":
//       return handleGet(req, res);
//     case "POST":
//       return handlePost(req, res);
//     case "PUT":
//       return handlePut(req, res);
//     case "DELETE":
//       return handleDelete(req, res);
//     default:
//       return res.status(405).json({ error: "Method not allowed" });
//   }
// }

// // Handle GET request - Retrieve all books or a single book by ID
// async function handleGet(req: NextApiRequest, res: NextApiResponse) {
//   const { id } = req.query;

//   try {
//     if (id) {
//       // Retrieve a single book by ID
//       const book = await prisma.book.findUnique({
//         where: { id: parseInt(id as string, 10) },
//       });
//       if (book) {
//         return res.status(200).json(book);
//       } else {
//         return res.status(404).json({ error: "Book not found" });
//       }
//     } else {
//       // Retrieve all books
//       const books = await prisma.book.findMany();
//       return res.status(200).json(books);
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Failed to fetch books" });
//   }
// }

// // Handle POST request - Create a new book
// async function handlePost(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const parsedBody = bookSchema.parse(req.body);
//     const newBook = await prisma.book.create({
//       data: parsedBody,
//     });
//     return res.status(201).json(newBook);
//   } catch (error) {
//     console.error(error);
//     return res.status(400).json({ error: "Invalid data" });
//   }
// }

// // Handle PUT request - Update an existing book
// async function handlePut(req: NextApiRequest, res: NextApiResponse) {
//   const { id } = req.query;
//   const { title, author, description } = req.body;

//   try {
//     const parsedBody = bookSchema.partial().parse(req.body); // Partial allows some fields to be omitted
//     const updatedBook = await prisma.book.update({
//       where: { id: parseInt(id as string, 10) },
//       data: parsedBody,
//     });
//     return res.status(200).json(updatedBook);
//   } catch (error) {
//     console.error(error);
//     return res.status(400).json({ error: "Invalid data or book not found" });
//   }
// }

// // Handle DELETE request - Delete an existing book
// async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
//   const { id } = req.query;

//   try {
//     await prisma.book.delete({
//       where: { id: parseInt(id as string, 10) },
//     });
//     return res.status(204).end(); // No Content
//   } catch (error) {
//     console.error(error);
//     return res.status(404).json({ error: "Book not found" });
//   }
// }
