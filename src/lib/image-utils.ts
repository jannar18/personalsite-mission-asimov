/**
 * Read image dimensions from PNG and JPEG files at build time.
 * Zero external dependencies — reads headers directly.
 *
 * PNG: 8-byte signature, then IHDR → width at offset 16, height at offset 20
 * JPEG: scan for SOF0/SOF2 markers (0xFF 0xC0 / 0xFF 0xC2) → height then width
 */

import { openSync, readSync, closeSync, statSync } from "fs";
import { join } from "path";

export interface ImageDimensions {
  width: number;
  height: number;
}

const VIDEO_EXTENSIONS = /\.(mov|mp4|webm)$/i;
const SVG_EXTENSION = /\.svg$/i;
const PNG_EXTENSION = /\.png$/i;
const JPEG_EXTENSION = /\.(jpe?g)$/i;

function readPngDimensions(fd: number): ImageDimensions | null {
  const header = Buffer.alloc(24);
  const bytesRead = readSync(fd, header, 0, 24, 0);

  if (
    bytesRead >= 24 &&
    header[0] === 0x89 &&
    header[1] === 0x50 &&
    header[2] === 0x4e &&
    header[3] === 0x47
  ) {
    return {
      width: header.readUInt32BE(16),
      height: header.readUInt32BE(20),
    };
  }
  return null;
}

function readJpegDimensions(fd: number): ImageDimensions | null {
  // Read up to 64KB — SOF marker is usually within the first few KB
  const maxBytes = 65536;
  let fileSize: number;
  try {
    // fstatSync not available on fd, use a larger buffer and track bytesRead
    const buf = Buffer.alloc(maxBytes);
    fileSize = readSync(fd, buf, 0, maxBytes, 0);

    // Verify JPEG SOI marker
    if (fileSize < 2 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;

    let offset = 2;
    while (offset < fileSize - 1) {
      // Find next marker (0xFF followed by non-zero)
      if (buf[offset] !== 0xff) {
        offset++;
        continue;
      }
      const marker = buf[offset + 1];

      // SOF0 (baseline) or SOF2 (progressive) — these contain dimensions
      if (marker === 0xc0 || marker === 0xc2) {
        if (offset + 9 < fileSize) {
          const height = buf.readUInt16BE(offset + 5);
          const width = buf.readUInt16BE(offset + 7);
          if (width > 0 && height > 0) {
            return { width, height };
          }
        }
        return null;
      }

      // Skip other markers: read segment length and jump past
      if (offset + 3 < fileSize) {
        const segLen = buf.readUInt16BE(offset + 2);
        offset += 2 + segLen;
      } else {
        break;
      }
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Get dimensions for an image path (relative to /public).
 * - PNG: reads IHDR header
 * - JPEG: scans for SOF0/SOF2 marker
 * - Video: returns 9:16 portrait default (1080x1920) — most are phone recordings
 * - SVG/Unknown: returns square default (800x800)
 */
export function getImageDimensions(imagePath: string): ImageDimensions {
  if (VIDEO_EXTENSIONS.test(imagePath)) {
    return { width: 1080, height: 1920 };
  }

  if (SVG_EXTENSION.test(imagePath)) {
    return { width: 800, height: 800 };
  }

  let fd: number | null = null;
  try {
    const absolutePath = join(process.cwd(), "public", imagePath);
    statSync(absolutePath); // verify file exists
    fd = openSync(absolutePath, "r");

    if (PNG_EXTENSION.test(imagePath)) {
      const dims = readPngDimensions(fd);
      if (dims) return dims;
    } else if (JPEG_EXTENSION.test(imagePath)) {
      const dims = readJpegDimensions(fd);
      if (dims) return dims;
    } else {
      // Try PNG first, then JPEG for unknown extensions
      const pngDims = readPngDimensions(fd);
      if (pngDims) return pngDims;
      const jpegDims = readJpegDimensions(fd);
      if (jpegDims) return jpegDims;
    }
  } catch {
    console.warn(`[image-utils] Failed to read dimensions for: ${imagePath}`);
  } finally {
    if (fd !== null) closeSync(fd);
  }

  return { width: 800, height: 800 };
}
