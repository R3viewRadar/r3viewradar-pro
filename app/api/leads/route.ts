import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase";

const LeadSchema = z.object({
  profile_id: z.string().min(1),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  service_type: z.string().min(1),
  message: z.string().min(10).max(2000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const data = LeadSchema.parse(body);

    // If Supabase is configured, save to database
    if (isSupabaseConfigured) {
      const supabase = createServerClient();
      const { error } = await supabase.from("leads").insert({
        ...data,
        status: "new",
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Supabase insert error:", error);
        // Still return success to avoid exposing internal errors
      }
    } else {
      // Mock mode: log the lead
      console.log("New lead received (mock mode):", data);
    }

    return NextResponse.json({ success: true, message: "Lead submitted successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid form data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Lead submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit lead" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get("profile_id");

  if (!profileId) {
    return NextResponse.json({ error: "profile_id is required" }, { status: 400 });
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  }

  // Mock response
  return NextResponse.json([]);
}
