"use client";

import { z } from "zod";

const searchSchema = z.object({
  search: z.string().min(1, { message: "This field cannot be empty" }).trim(),
});

export default searchSchema;
