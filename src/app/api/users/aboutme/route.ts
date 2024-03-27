import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connectDB();

export async function POST(request: NextRequest) {
  const userId = await getDataFromToken(request);
  const user = User.findOne({ _id: userId }).select("-password");
  return NextResponse.json({
    message: "User Found",
    data: user,
  });
}
