import { createMocks } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
import handleGet from "../pages/api/signature/index";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

jest.mock("@prisma/client", () => ({
  prisma: {
    sign: {
      findMany: jest.fn(),
    },
  },
}));

describe("API: handleGet", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Devrait retourner 401 si le cookie de session est manquant", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      cookies: {},
    });

    await handleGet(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({
      error: "Authorization token required",
    });
  });

  test("Devrait retourner 200 et les signatures si l’utilisateur est authentifié", async () => {
    const fakeSigns = [
      { id: 1, name: "Signature1" },
      { id: 2, name: "Signature2" },
    ];
    (prisma.sign.findMany as jest.Mock).mockResolvedValue(fakeSigns);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      cookies: { session: "valid-token" },
    });

    await handleGet(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ signs: fakeSigns });
    expect(prisma.sign.findMany).toHaveBeenCalledTimes(1);
  });

  test("Devrait retourner 500 en cas d’erreur interne", async () => {
    (prisma.sign.findMany as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      cookies: { session: "valid-token" },
    });

    await handleGet(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "Internal server error" });
  });
});
