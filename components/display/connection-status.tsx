"use client";

import { Wifi, WifiOff } from "lucide-react";

type ConnectionStatusProps = {
  isConnected: boolean;
};

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <div className="absolute top-4 left-4 z-10">
      <div
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
          isConnected
            ? "bg-green-900/50 text-green-300"
            : "bg-red-900/50 text-red-300"
        }`}
      >
        {isConnected ? (
          <>
            <Wifi className="h-4 w-4" />
            <span>Connected</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            <span>Reconnecting...</span>
          </>
        )}
      </div>
    </div>
  );
}
