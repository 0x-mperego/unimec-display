"use client";

import { useCallback, useEffect, useState } from "react";
import type { Content } from "@/lib/supabase/client";
import { ContentRenderer } from "./content-renderer";

export function DisplayScreen() {
  const [contents, setContents] = useState<Content[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Define loadContents first
  const loadContents = useCallback(async () => {
    try {
      const response = await fetch("/api/contents");
      if (response.ok) {
        const data = await response.json();
        setContents(data);
        setIsConnected(true);
        if (data.length > 0 && currentIndex >= data.length) {
          setCurrentIndex(0);
        }
      } else {
        setIsConnected(false);
      }
    } catch (_error) {
      setIsConnected(false);
    }
  }, [currentIndex]);

  // Load initial contents
  useEffect(() => {
    loadContents();
  }, [loadContents]);

  // Set up Server-Sent Events for real-time updates
  useEffect(() => {
    const eventSource = new EventSource("/api/sse/contents");

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "contents_updated") {
          setContents(data.contents);
          // Reset to first content if current index is out of bounds
          setCurrentIndex((prevIndex) =>
            prevIndex >= data.contents.length ? 0 : prevIndex
          );
        }
      } catch (_error) {}
    };

    eventSource.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Content rotation logic
  useEffect(() => {
    if (contents.length === 0) {
      return;
    }

    const currentContent = contents[currentIndex];
    if (!currentContent) {
      return;
    }

    const duration = currentContent.duration * 1000; // Convert to milliseconds

    const timer = setTimeout(() => {
      const newIndex = (currentIndex + 1) % contents.length;
      setCurrentIndex(newIndex);
    }, duration);

    return () => clearTimeout(timer);
  }, [contents, currentIndex]);

  // Fullscreen functionality
  const toggleFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (_error) {}
    } else {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (_error) {}
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);


  // Auto-reconnect logic
  useEffect(() => {
    if (!isConnected) {
      const reconnectTimer = setTimeout(() => {
        loadContents();
      }, 5000); // Try to reconnect every 5 seconds

      return () => clearTimeout(reconnectTimer);
    }
  }, [isConnected, loadContents]);

  const currentContent = contents[currentIndex];

  return (
    <div
      className={`relative min-h-screen overflow-hidden bg-black text-white ${
        isFullscreen ? "cursor-none" : "cursor-pointer"
      }`}
      onClick={toggleFullscreen}
    >
      {/* Content Display */}
      <div className="relative h-screen w-full overflow-hidden">
        {contents.length > 0 && currentContent && (
          <div className="absolute inset-0">
            <ContentRenderer content={currentContent} />
          </div>
        )}
      </div>

      {/* Fullscreen hint */}
      {!isFullscreen && contents.length > 0 && (
        <div className="absolute bottom-4 left-4 animate-pulse text-gray-500 text-sm">
          Clicca ovunque per lo schermo intero
        </div>
      )}

      {/* Content indicator */}
      {contents.length > 1 && (
        <div className="absolute right-4 bottom-4 text-gray-500 text-sm">
          {currentIndex + 1} / {contents.length}
        </div>
      )}
    </div>
  );
}
