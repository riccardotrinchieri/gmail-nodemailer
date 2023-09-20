import { z } from "zod";

export const postMailBodyValidationSchema = z.object({
  addresses: z.array(z.string().nonempty().email()).nonempty(),
  content: z.string().nonempty(),
  subject: z.string().nonempty(),
});

export type PostMailDTO = z.infer<typeof postMailBodyValidationSchema>;
