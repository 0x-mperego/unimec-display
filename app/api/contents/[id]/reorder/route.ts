import { type NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import type { Content } from "@/lib/supabase/client";
import { supabase } from "@/lib/supabase/client";

type Direction = "up" | "down";

interface ReorderUpdate {
  id: string;
  order_index: number;
}

async function validateDirection(direction: string): Promise<boolean> {
  return ["up", "down"].includes(direction);
}

async function fetchCurrentContent(id: string): Promise<Content | null> {
  const { data, error } = await supabase
    .from("contents")
    .select("*")
    .eq("id", id)
    .single();

  return error ? null : data;
}

async function fetchAllContents(): Promise<Content[] | null> {
  const { data, error } = await supabase
    .from("contents")
    .select("*")
    .order("order_index", { ascending: true });

  return error ? null : data;
}

function calculateTargetIndex(
  currentIndex: number,
  direction: Direction,
  totalItems: number
): number | null {
  if (direction === "up" && currentIndex > 0) {
    return currentIndex - 1;
  }
  if (direction === "down" && currentIndex < totalItems - 1) {
    return currentIndex + 1;
  }
  return null; // Already at edge
}

async function updateContentOrders(updates: ReorderUpdate[]): Promise<boolean> {
  for (const update of updates) {
    const { error } = await supabase
      .from("contents")
      .update({
        order_index: update.order_index,
        updated_at: new Date().toISOString(),
      })
      .eq("id", update.id);

    if (error) {
      return false;
    }
  }
  return true;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { direction } = await request.json();

    if (!(await validateDirection(direction))) {
      return NextResponse.json(
        { message: 'Invalid direction. Must be "up" or "down"' },
        { status: 400 }
      );
    }

    const currentContent = await fetchCurrentContent(id);
    if (!currentContent) {
      return NextResponse.json(
        { message: "Content not found" },
        { status: 404 }
      );
    }

    const allContents = await fetchAllContents();
    if (!allContents) {
      return NextResponse.json(
        { message: "Failed to fetch contents" },
        { status: 500 }
      );
    }

    const currentIndex = allContents.findIndex((content) => content.id === id);
    if (currentIndex === -1) {
      return NextResponse.json(
        { message: "Content not found in list" },
        { status: 404 }
      );
    }

    const targetIndex = calculateTargetIndex(
      currentIndex,
      direction,
      allContents.length
    );

    if (targetIndex === null) {
      // Already at edge, no change needed
      return NextResponse.json(currentContent);
    }

    const targetContent = allContents[targetIndex];
    const updates: ReorderUpdate[] = [
      { id: currentContent.id, order_index: targetContent.order_index },
      { id: targetContent.id, order_index: currentContent.order_index },
    ];

    const updateSuccess = await updateContentOrders(updates);
    if (!updateSuccess) {
      return NextResponse.json(
        { message: "Failed to reorder content" },
        { status: 500 }
      );
    }

    const updatedContent = await fetchCurrentContent(id);
    if (!updatedContent) {
      return NextResponse.json(
        { message: "Failed to fetch updated content" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedContent);
  } catch (_error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
