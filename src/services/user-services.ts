import { prisma } from "../database/prisma";
import bcrypt from "bcrypt";

async function validateCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } }) as any | null;
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  const { password: _pwd, ...safeUser } = user;
  return safeUser;
}

export default { validateCredentials };
