import { z } from "zod"

export const createCompanySchema = z.object({
    businessRut: z
        .string({
            required_error: "required businessRut",
        }),
    businessName: z
        .string({
            required_error: "required businessName",
        }),
    agent: z
        .string({
            required_error: "required agent",
        }),
})