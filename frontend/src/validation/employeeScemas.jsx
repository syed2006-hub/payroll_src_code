import { z } from "zod";

export const basicSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  employeeId: z.string().min(1, "Employee ID is required"),
  email: z.string().email("Invalid work email address"),
  doj: z.string().min(1, "Date of joining is required"),
  mobile: z.string().regex(/^[0-9]{10}$/, "Invalid mobile number").optional().or(z.literal("")),
  gender: z.enum(["Male", "Female", "Others"], { errorMap: () => ({ message: "Select gender" }) }),
  location: z.string().min(1, "Work location is required"),
  role: z.string().min(1, "role is required"),
  department: z.string().min(1, "Department is required"),
  isDirector: z.boolean().default(false),
  enablePortal: z.boolean().default(true),
});

export const salarySchema = z.object({
  ctc: z.coerce.number().positive("Annual CTC must be a positive number"),
  basicPercentage: z.coerce.number().min(1).max(100).default(50),
});

export const personalSchema = z.object({
  dob: z.string().min(1, "Date of birth is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format").optional().or(z.literal("")),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Invalid PIN code"),
});

export const paymentSchema = z.object({
  mode: z.enum(["DIRECT", "BANK", "CHEQUE", "CASH"], { 
    errorMap: () => ({ message: "Please select a payment mode" }) 
  }),
});