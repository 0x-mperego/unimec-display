"use client";

import { useCallback, useEffect, useState } from "react";
import type { Content } from "@/lib/supabase/client";
import { ConnectionStatus } from "./connection-status";
import { ContentRenderer } from "./content-renderer";

export function DisplayScreen() {
  const [contents, setContents] = useState<Content[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fadeClass, setFadeClass] = useState("opacity-100");

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
      // Fade out
      setFadeClass("opacity-0");

      // After fade out, change content and fade in
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % contents.length);
        setFadeClass("opacity-100");
      }, 300); // 300ms fade duration
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
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
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
      className="relative min-h-screen cursor-pointer overflow-hidden bg-black text-white"
      onClick={toggleFullscreen}
    >
      {/* Connection Status */}
      <ConnectionStatus isConnected={isConnected} />

      {/* Content Display */}
      <div
        className={`h-screen w-full transition-opacity duration-300 ease-in-out ${fadeClass}`}
      >
        {contents.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h1 className="mb-4 font-bold text-4xl">Display Manager</h1>
              <p className="text-gray-400 text-xl">
                {isConnected
                  ? "Nessun contenuto da visualizzare"
                  : "Connessione in corso..."}
              </p>
              {!isConnected && (
                <div className="mt-4">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
            </div>
          </div>
        ) : currentContent ? (
          <ContentRenderer content={currentContent} />
        ) : null}
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
