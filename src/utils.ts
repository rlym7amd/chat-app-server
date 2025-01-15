import bcrypt from "bcrypt";
import { importPKCS8, importSPKI, JWTPayload, jwtVerify, SignJWT } from "jose";

export async function validatePassword(
  password: string,
  candidatePassword: string
) {
  return await bcrypt.compare(password, candidatePassword);
}

export async function signJWT(payload: JWTPayload, timeToLive: string) {
  const alg = "RS256";
  const pkcs8 = process.env.PRIVATE_KEY as string;

  const privateKey = await importPKCS8(pkcs8, alg);

  return await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(timeToLive)
    .sign(privateKey);
}

export async function verifyJwt(jwt: string) {
  const alg = "RS256";
  const spki = process.env.PUBLIC_KEY as string;

  const publicKey = await importSPKI(spki, alg);

  try {
    const decoded = await jwtVerify(jwt, publicKey);

    return decoded;
  } catch {
    return null;
  }
}
