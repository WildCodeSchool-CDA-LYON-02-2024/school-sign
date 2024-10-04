// import { NextApiRequest, NextApiResponse } from "next";
// import bcrypt from "bcrypt";
// import { registerSchemaUser } from "@/lib/schemas/registerSchemaUser";
// import { prisma } from "@/lib/client";
// import { Prisma } from "@prisma/client";
//
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   if (req.method === "POST") {
//     try {
//       // Validate request body
//       const data = registerSchemaUser.parse(req.body);
//       console.log(data);
//
//       // Verify if user already exists
//       const existingUser = await prisma.user.findFirst({
//         where: { email: data.email },
//       });
//
//       if (existingUser) {
//         return res.status(400).json({ error: "Email already in use" });
//       }
//
//       // Password hashing
//       const hashedPassword = await bcrypt.hash(data.password, 10);
//
//       // Ensure request contains schoolId (passed from frontend or inferred)
//
//       // User creation
//       const user = await prisma.user.create({
//         data: {
//           firstname: data.firstname,
//           lastname: data.lastname,
//           email: data.email,
//           password: hashedPassword,
//         },
//       });
//
//       // Response success
//       res.status(201).json({ user });
//     } catch (error: any) {
//       if (error instanceof Prisma.PrismaClientKnownRequestError) {
//         // Manage Prisma error
//         return res.status(400).json({ error: "Database error" });
//       }
//       res.status(400).json({ error: error.message });
//     } finally {
//       await prisma.$disconnect();
//     }
//   } else {
//     // Unsupported method
//     res.status(405).json({ error: "Method not allowed" });
//   }
// }
