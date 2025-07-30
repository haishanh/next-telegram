import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return Response.json({ name: "John Doe" });
}
