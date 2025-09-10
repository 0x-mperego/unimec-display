import { type NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const updates = await request.json();

    const { data: updatedContent, error } = await supabase
      .from("contents")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { message: "Failed to update content", error: error.message },
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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the content first to check if it's an image
    const { data: content, error: fetchError } = await supabase
      .from("contents")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !content) {
      return NextResponse.json(
        { message: "Content not found" },
        { status: 404 }
      );
    }

    // Delete the content record
    const { error: deleteError } = await supabase
      .from("contents")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json(
        { message: "Failed to delete content", error: deleteError.message },
        { status: 500 }
      );
    }

    // If it's an image, also delete the file from storage
    if (content.type === "image" && content.data?.storagePath) {
      await supabase.storage
        .from("content-images")
        .remove([content.data.storagePath]);
    }

    return NextResponse.json({ message: "Content deleted successfully" });
  } catch (_error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
