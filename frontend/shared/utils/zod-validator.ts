import { Rule } from "antd/es/form";

/**
 * Creates an Ant Design Form validator rule from a Zod schema field.
 * Safely inspects properties to support both Zod Object and Zod Effects (refine) schemas
 * without importing type definitions that differ between Zod versions.
 */
export const zodRule = (schema: any, fieldName: string): Rule => ({
  validator: async (_, value) => {
    if (!schema) return Promise.resolve();

    let targetSchema = schema;
    
    // Unwrap ZodEffects (.refine) to get the underlying object schema
    while (targetSchema && typeof targetSchema.innerType === "function") {
      targetSchema = targetSchema.innerType();
    }

    const fieldSchema = targetSchema?.shape?.[fieldName];
    if (!fieldSchema) return Promise.resolve();

    // Parse empty strings as undefined for better validation on optional/number fields
    const parsedValue = value === "" ? undefined : value;
    const result = fieldSchema.safeParse(parsedValue);

    if (!result.success) {
      return Promise.reject(new Error(result.error.issues[0].message));
    }
    return Promise.resolve();
  },
});
