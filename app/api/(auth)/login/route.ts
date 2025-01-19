import jwt from "jsonwebtoken";
import Company from "@/app/models/compeny.models";
import connectToDatabase from "@/app/db/connect";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const { companyName, password } = await req.json();

  if (!companyName || !password)
    return NextResponse.json(
      { message: "Company name and password are required!" },
      { status: 400 }
    );

  try {
    const company = await Company.findOne({
      companyName: companyName.toLowerCase(),
    });
    if (!company) {
      return NextResponse.json(
        { message: "Company not found!" },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, company.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials!" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: company._id, companyName: company.companyName },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const response = NextResponse.json(
      {
        message: "Login successful!",
        token,
      },
      { status: 201 }
    );

    response.cookies.set("artFinder", token);
    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error during login!",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
