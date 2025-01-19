import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the Company document
interface ICompany extends Document {
  companyName: string;
  password: string;
  description: string;
  domain: string;
  createdAt: Date;
}

// Define the Company schema
const companySchema = new Schema<ICompany>({
  companyName: {
    type: String,
    required: true,
    unique: true, // Ensure the company name is unique
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  domain: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Company model
const Company =
  mongoose.models.Company || mongoose.model<ICompany>("Company", companySchema);

export default Company;
