export function getResponse(statusCode: number = 200) {
  return { statusCode };
}

export function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is required`);

  return value;
}
