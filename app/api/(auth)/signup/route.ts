import Company from "@/app/models/compeny.models";
import connectToDatabase from "@/app/db/connect";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const { companyName, password, description, domain } = await req.json();

  if (!companyName || !password || !description || !domain) {
    return NextResponse.json(
      { message: "All fields are required!" },
      { status: 400 }
    );
  }

  try {
    const existingCompany = await Company.findOne({ companyName });
    if (existingCompany) {
      return NextResponse.json(
        {
          message: "Company already exists!",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCompany = await Company.create({
      companyName: companyName.toLowerCase(),
      password: hashedPassword,
      description,
      domain,
    });

    // Generate a token for the newly created company
    const token = jwt.sign(
      { id: newCompany._id, companyName: newCompany.companyName },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const response = NextResponse.json(
      {
        message: "Company registered successfully!",
        company: newCompany,
        token,
      },
      { status: 200 }
    );

    response.cookies.set("artFinder", token);

    return response;
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "Error registering company!",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
