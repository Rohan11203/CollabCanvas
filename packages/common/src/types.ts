import { z } from "zod";

export const CreateUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name should not exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .max(255, "Email should not exceed 255 characters"),
  password: z
    .string()
    .min(6, "Password should be at least 6 characters long")
    .max(100, "Password should not exceed 100 characters")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/\d/, "Password must include at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must include at least one special character"
    ),
});

export const SigninSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .max(255, "Email should not exceed 255 characters"),
  password: z
    .string()
    .min(6, "Password should be at least 6 characters long")
    .max(100, "Password should not exceed 100 characters")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/\d/, "Password must include at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must include at least one special character"
    ),
});

export const CreateRoomSchema = z.object({
  name: z.string().min(3).max(20),
});
