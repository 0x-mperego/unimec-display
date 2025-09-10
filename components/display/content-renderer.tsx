"use client";

import Image from "next/image";
import type { Content } from "@/lib/supabase/client";

type ContentRendererProps = {
  content: Content;
};

export function ContentRenderer({ content }: ContentRendererProps) {
  if (content.type === "image") {
    return (
      <div className="relative h-full w-full">
        <Image
          alt="Display content"
          className="object-contain"
          fill
          priority
          sizes="100vw"
          src={content.data.url}
        />
      </div>
    );
  }

  if (content.type === "text") {
    const textStyle = {
      fontFamily: content.data.fontFamily || "Inter, sans-serif",
      fontSize: `${content.data.fontSize || 48}px`,
      color: content.data.textColor || "#ffffff",
      backgroundColor: content.data.backgroundColor || "#000000",
      textAlign: (content.data.textAlign || "center") as
        | "left"
        | "center"
        | "right",
    };

    return (
      <div
        className="flex h-full w-full items-center justify-center p-8"
        style={{ backgroundColor: textStyle.backgroundColor }}
      >
        <div
          className="max-w-full leading-relaxed"
          style={{
            fontFamily: textStyle.fontFamily,
            fontSize: textStyle.fontSize,
            color: textStyle.color,
            textAlign: textStyle.textAlign,
          }}
        >
          {content.data.text}
        </div>
      </div>
    );
  }

  // Fallback for unknown content types
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <h2 className="mb-2 font-bold text-2xl">Unknown Content Type</h2>
        <p className="text-gray-400">Cannot display this content</p>
      </div>
    </div>
  );
}
