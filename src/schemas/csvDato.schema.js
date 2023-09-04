import { z } from 'zod'

export const createCsvSchema = z.object({
    codProducto: z
        .string({
            required_error: "Cod Producto required",
        }),
    cantidadProducto: z
        .number({
            required_error: "Cantidad Producto required",
        }),
    precioUnitario: z
        .number({
            required_error: "Precio Unitario required",
        }),
    descuento: z
        .boolean({
            required_error: "Descuento required",
        }),
    total: z
        .number({
            required_error: "Total required",
        }),
    fechaVenta: z
        .string().datetime({
            required_error: "Please select a date",
            invalid_type_error: "That's not a date!",
        })
})