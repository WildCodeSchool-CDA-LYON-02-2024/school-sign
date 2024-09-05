<<<<<<< HEAD
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}
=======
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

interface CustomJWTPayload extends JWTPayload {
  userId: number;
  schoolId: number;
}

export async function createToken(payload: CustomJWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<CustomJWTPayload> {
  const { payload } = await jwtVerify(token, secret);
<<<<<<< HEAD
  return payload;
}
>>>>>>> d0b66f192f25ae89b46c8f6d74330ab5f3806167
=======
  return payload as CustomJWTPayload;
}
>>>>>>> 36b561ae554261988280fb3f6845f2b5d7895522
