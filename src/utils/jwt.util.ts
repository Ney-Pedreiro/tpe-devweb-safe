export const generateToken = (payload: any): string => {
  // Implementação simples sem dependências externas
  // Em produção, recomendo usar jsonwebtoken
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

export const verifyToken = (token: string): any => {
  try {
    return JSON.parse(Buffer.from(token, 'base64').toString());
  } catch (error) {
    throw new Error('Token inválido');
  }
};
