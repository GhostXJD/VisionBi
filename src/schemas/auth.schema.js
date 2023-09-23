import { z } from "zod"

export const registroSchema = z.object({
    rut: z
        .string({
            required_error: "Rut required",
        }),
    nombre: z
        .string({
            required_error: "Nombre required",
        }),
    apellido: z
        .string({
            required_error: "Apellido required",
        }),
    correo: z
        .string({
            required_error: "Email required",
        }).email({
            message: "Invalid email address"
        }),
    password: z
        .string({
            required_error: "Password is required",
        }).min(5, {
            message: "La contraseña debe tener minimo 5 caracteres"
        }),
    active: z
        .boolean({
            required_error: "active is required",
        }),
    tipoUsuario: z
        .string({
            required_error: "Type user is required",
        }),
    company: z
        .string({
            required_error: "Company is required",
        })
});

export const loginSchema = z.object({
    correo: z
        .string({
            required_error: "Email required",
        })
        .email({
            message: "El correo no es valido"
        }),
    password: z
        .string({
            required_error: "Contraseña incorrecta",
        })
        .min(5, {
            message: "Contraseña incorrecta"
        }),
});