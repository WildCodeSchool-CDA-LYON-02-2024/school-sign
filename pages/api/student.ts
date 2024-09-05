import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient,Role } from "@prisma/client";

import { registerSchemaUser } from "@/lib/schemas/registerSchemaUser"; 
import { verifyToken } from "@/lib/jwt"; 
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Extract the token from cookies
      const tokenCookie = req.cookies.session;
      if (!tokenCookie) {
        return res.status(401).json({ error: "Authorization token required" });
      }

      // Verify the token and extract the payload
      const payload = await verifyToken(tokenCookie);
      const schoolId = payload.schoolId;
      if (!schoolId) {
        return res.status(400).json({ error: "School ID missing from token" });
      }

      // Validate input data using the schema
      const data = registerSchemaUser.parse(req.body);
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create the user with the associated school (using schoolId from token)
      const user = await prisma.user.create({
        data: {
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          password: hashedPassword,
          school: { connect: { id: schoolId } },
          role: Role.STUDENT,
        }
      });

      // Respond with the created user
      res.status(201).json({ user });

    } catch (error: any) {
      // Handle validation and other exceptions
      if (error.name === "ZodError") {
        return res.status(400).json({ error: error.errors });
      }

      console.error("API Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
