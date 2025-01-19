import connectToDatabase from "@/app/db/connect";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    const token = req.cookies.get("artFinder")?.value;

    if (!token) {
      return NextResponse.json({ message: "No token found" }, { status: 400 });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);

    return NextResponse.json({ decodedToken });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: "Error retrieving token",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
