// Replicate API helper functions
import Replicate from "replicate";

// Initialize Replicate client
export function getReplicateClient() {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    return null;
  }
  return new Replicate({ auth: token });
}

// Check if Replicate is configured
export function isReplicateConfigured(): boolean {
  return !!process.env.REPLICATE_API_TOKEN;
}

// Convert file to base64 data URL
export async function fileToDataUrl(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  return `data:${file.type};base64,${base64}`;
}

// Demo images for fallback
export const demoImages = {
  petPortrait: [
    "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800",
    "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800",
    "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=800",
    "https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?w=800",
  ],
  restoration: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800",
  enhanced: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600",
  removedBg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
  styleTransfer: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800",
  headshot: [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800",
  ],
};
