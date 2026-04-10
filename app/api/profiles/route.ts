import { NextRequest, NextResponse } from "next/server";
import { searchProfiles } from "@/lib/mock-data";
import type { Category } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") as Category | undefined;
  const location = searchParams.get("location") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1");
  const perPage = parseInt(searchParams.get("per_page") ?? "12");

  const results = searchProfiles(query, category, location);

  const start = (page - 1) * perPage;
  const paginated = results.slice(start, start + perPage);

  return NextResponse.json({
    profiles: paginated,
    total: results.length,
    page,
    per_page: perPage,
    total_pages: Math.ceil(results.length / perPage),
  });
}
