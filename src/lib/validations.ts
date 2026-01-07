import { z } from "zod";

// Contact inquiry form validation
export const contactInquirySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^[0-9()\-\s+]*$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  serviceId: z.string().uuid("Invalid service").optional().or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
  captchaToken: z.string().min(1, "Please complete the CAPTCHA"),
});

export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;

// Admin login validation
export const adminLoginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username must be less than 50 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(100, "Password must be less than 100 characters"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

// Site settings update validation
export const siteSettingsSchema = z.object({
  serviceAreaLat: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  serviceAreaLng: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
  serviceAreaMiles: z
    .number()
    .int("Miles must be a whole number")
    .min(1, "Service area must be at least 1 mile")
    .max(500, "Service area must be less than 500 miles"),
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name must be less than 100 characters"),
  companyPhone: z
    .string()
    .min(1, "Phone number is required")
    .max(20, "Phone number must be less than 20 characters"),
  companyEmail: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  companyAddress: z
    .string()
    .max(500, "Address must be less than 500 characters")
    .optional()
    .or(z.literal("")),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

// Inquiry status update validation
export const inquiryStatusSchema = z.object({
  status: z.enum(["NEW", "READ", "RESPONDED", "ARCHIVED"]),
});

export type InquiryStatusInput = z.infer<typeof inquiryStatusSchema>;

// Service creation/update validation (for admin)
export const serviceSchema = z.object({
  name: z
    .string()
    .min(1, "Service name is required")
    .max(100, "Service name must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),
  imageUrl: z
    .string()
    .url("Please enter a valid URL")
    .max(500, "URL must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  isSubcontracted: z.boolean(),
  categoryId: z.string().uuid("Please select a valid category"),
  displayOrder: z.number().int().min(0).optional(),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

// Category creation/update validation (for admin)
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  displayOrder: z.number().int().min(0).optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
