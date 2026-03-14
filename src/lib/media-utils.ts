/** Shared media type detection utilities. */

const VIDEO_REGEX = /\.(mov|mp4|webm)$/i;

export function isVideo(src: string): boolean {
  return VIDEO_REGEX.test(src);
}
