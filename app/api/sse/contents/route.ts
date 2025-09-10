import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase/client";

// Store active connections
const connections = new Set<ReadableStreamDefaultController>();
const HEARTBEAT_INTERVAL = 30_000; // 30 seconds

export function GET(request: NextRequest) {
  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Add this connection to our set
      connections.add(controller);

      // Send initial data
      sendInitialData(controller);

      // Set up heartbeat to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(": heartbeat\n\n"));
        } catch (_error) {
          // Connection closed
          clearInterval(heartbeat);
          connections.delete(controller);
        }
      }, HEARTBEAT_INTERVAL);

      // Clean up when connection closes
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        connections.delete(controller);
        try {
          controller.close();
        } catch (_error) {
          // Ignore errors when closing
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  });
}

async function sendInitialData(controller: ReadableStreamDefaultController) {
  try {
    const { data: contents, error } = await supabase
      .from("contents")
      .select("*")
      .order("order_index", { ascending: true });

    if (!error && contents) {
      const message = `data: ${JSON.stringify({
        type: "contents_updated",
        contents,
        timestamp: new Date().toISOString(),
      })}\n\n`;

      controller.enqueue(new TextEncoder().encode(message));
    }
  } catch (_error) {
    // Silently ignore errors when sending initial data
  }
}

// Function to broadcast updates to all connected clients
export async function broadcastContentUpdate() {
  try {
    const { data: contents, error } = await supabase
      .from("contents")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      return;
    }

    const message = `data: ${JSON.stringify({
      type: "contents_updated",
      contents,
      timestamp: new Date().toISOString(),
    })}\n\n`;

    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(message);

    // Send to all connected clients
    for (const controller of connections) {
      try {
        controller.enqueue(encodedMessage);
      } catch (_error) {
        // Remove disconnected clients
        connections.delete(controller);
      }
    }
  } catch (_error) {
    // Silently ignore errors when broadcasting updates
  }
}

// Set up Supabase real-time subscription to trigger broadcasts
// This will run when the module is loaded
supabase
  .channel("contents_changes")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "contents",
    },
    () => {
      // Broadcast update when contents table changes
      broadcastContentUpdate();
    }
  )
  .subscribe();
