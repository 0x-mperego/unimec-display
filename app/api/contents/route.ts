import { type NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";

const MAX_CONTENT_LIMIT = 50;

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("contents")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      return NextResponse.json(
        { message: "Failed to fetch contents", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (_error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { type, data, duration, orderIndex } = await request.json();

    if (!(type && data && duration)) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate content limits
    const { count } = await supabase
      .from("contents")
      .select("*", { count: "exact", head: true });

    if (count && count >= MAX_CONTENT_LIMIT) {
      return NextResponse.json(
        {
          message: `Content limit reached (${MAX_CONTENT_LIMIT} items maximum)`,
        },
        { status: 400 }
      );
    }

    // Get the next order index if not provided
    let nextOrderIndex = orderIndex;
    if (nextOrderIndex === undefined) {
      const { data: lastContent } = await supabase
        .from("contents")
        .select("order_index")
        .order("order_index", { ascending: false })
        .limit(1)
        .single();

      nextOrderIndex = lastContent ? lastContent.order_index + 1 : 0;
    }

    const { data: newContent, error } = await supabase
      .from("contents")
      .insert({
        type,
        data,
        duration,
        order_index: nextOrderIndex,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { message: "Failed to create content", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(newContent);
  } catch (_error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
