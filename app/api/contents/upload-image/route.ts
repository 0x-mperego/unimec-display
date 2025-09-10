import { type NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";

const BYTES_PER_KB = 1024;
const BYTES_PER_MB = BYTES_PER_KB * 1024;
const MAX_FILE_SIZE = 10 * BYTES_PER_MB; // 10MB
const MAX_CONTENT_LIMIT = 50;
const RANDOM_STRING_LENGTH = 2;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const duration = Number.parseInt(formData.get("duration") as string, 10);
    const orderIndex = Number.parseInt(
      formData.get("orderIndex") as string,
      10
    );

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: "Invalid file type. Only JPG and PNG are allowed." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "File size exceeds 10MB limit." },
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

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(RANDOM_STRING_LENGTH)}.${fileExt}`;
    const filePath = `images/${fileName}`;

    // Upload to Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("content-images")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
      });

    if (uploadError) {
      return NextResponse.json(
        { message: "Failed to upload image", error: uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("content-images").getPublicUrl(filePath);

    // Create content record
    const contentData = {
      url: publicUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      storagePath: filePath,
    };

    const { data: newContent, error: dbError } = await supabase
      .from("contents")
      .insert({
        type: "image",
        data: contentData,
        duration,
        order_index: orderIndex,
      })
      .select()
      .single();

    if (dbError) {
      // Clean up uploaded file if database insert fails
      await supabase.storage.from("content-images").remove([filePath]);

      return NextResponse.json(
        { message: "Failed to create content record", error: dbError.message },
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
