import { ZodRawShape, z } from "zod";

export const validate = <T extends ZodRawShape>(
  obj: unknown,
  validationSchema: z.ZodObject<T>
) => {
  try {
    const parsedObj = validationSchema.parse(obj);
    return [parsedObj, null] as const;
  } catch (error) {
    return [null, error as {}] as const;
  }
};
