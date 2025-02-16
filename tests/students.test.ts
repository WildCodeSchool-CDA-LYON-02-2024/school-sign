import request from "supertest";
import { createServer } from "http";
import handler from "../pages/api/student";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Crée un serveur HTTP basé sur ton API Next.js
const server = createServer((req, res) => handler(req as any, res as any));

describe("Students API", () => {
  let token: string;

  beforeAll(async () => {
    // Générer un faux token (simule une authentification)
    token = "fake-valid-token"; // Remplace par une vraie génération si nécessaire

    // Nettoie la base de données avant les tests
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/students", () => {
    it("✅ Devrait créer un élève avec succès", async () => {
      const res = await request(server)
        .post("/api/students")
        .set("Cookie", `session=${token}`)
        .send({
          firstname: "John",
          lastname: "Doe",
          email: "john.doe@example.com",
          password: "Password123!",
          classId: 1,
        });

      expect(res.status).toBe(201);
      expect(res.body.user).toHaveProperty("id");
      expect(res.body.user.email).toBe("john.doe@example.com");
    });

    it("❌ Devrait retourner une erreur 400 si des champs sont manquants", async () => {
      const res = await request(server)
        .post("/api/student")
        .set("Cookie", `session=${token}`)
        .send({
          firstname: "Jane",
          email: "jane.doe@example.com",
          password: "Password123!",
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "Validation failed");
    });

    it("❌ Devrait retourner une erreur 409 si l'email existe déjà", async () => {
      await prisma.user.create({
        data: {
          firstname: "Jane",
          lastname: "Doe",
          email: "jane.doe@example.com",
          password: "hashedpassword",
          classId: 1,
          schoolId: 1,
        },
      });

      const res = await request(server)
        .post("/api/student")
        .set("Cookie", `session=${token}`)
        .send({
          firstname: "Jane",
          lastname: "Doe",
          email: "jane.doe@example.com",
          password: "Password123!",
          classId: 1,
        });

      expect(res.status).toBe(409);
      expect(res.body.error).toBe("Email already in use");
    });

    it("❌ Devrait retourner une erreur 401 si aucun token n'est fourni", async () => {
      const res = await request(server).post("/api/student").send({
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        password: "Password123!",
        classId: 1,
      });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Authorization token required");
    });
  });

  describe("GET /api/student", () => {
    it("✅ Devrait récupérer la liste des étudiants", async () => {
      const res = await request(server)
        .get("/api/student")
        .set("Cookie", `session=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.users).toBeInstanceOf(Array);
    });

    it("✅ Devrait récupérer un étudiant par ID", async () => {
      const student = await prisma.user.create({
        data: {
          firstname: "Alice",
          lastname: "Wonderland",
          email: "alice@example.com",
          password: "hashedpassword",
          classId: 1,
          schoolId: 1,
        },
      });

      const res = await request(server)
        .get(`/api/student?id=${student.id}`)
        .set("Cookie", `session=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe("alice@example.com");
    });

    it("❌ Devrait retourner 404 si l'élève n'existe pas", async () => {
      const res = await request(server)
        .get("/api/student?id=9999")
        .set("Cookie", `session=${token}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("User not found");
    });

    it("❌ Devrait retourner une erreur 401 si aucun token n'est fourni", async () => {
      const res = await request(server).get("/api/student");

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Authorization token required");
    });
  });

  describe("PUT /api/students/:id", () => {
    let studentId: number;

    beforeAll(async () => {
      const student = await prisma.user.create({
        data: {
          firstname: "Bob",
          lastname: "Marley",
          email: "bob@example.com",
          password: "hashedpassword",
          classId: 1,
          schoolId: 1,
        },
      });
      studentId = student.id;
    });

    it("✅ Devrait mettre à jour un étudiant", async () => {
      const res = await request(server)
        .put(`/api/student?id=${studentId}`)
        .set("Cookie", `session=${token}`)
        .send({ firstname: "Bobby" });

      expect(res.status).toBe(200);
      expect(res.body.firstname).toBe("Bobby");
    });

    it("❌ Devrait retourner 400 si l'ID est invalide", async () => {
      const res = await request(server)
        .put("/api/student?id=abc")
        .set("Cookie", `session=${token}`)
        .send({ firstname: "Bobby" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid data or class not found");
    });
  });
});
