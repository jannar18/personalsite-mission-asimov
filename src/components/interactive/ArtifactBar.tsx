import Image from "next/image";

interface Artifact {
  slug: string;
  date: string;
  mood?: string;
  image: string;
  project?: string;
  description?: string;
}

interface ArtifactBarProps {
  artifacts: Artifact[];
}

/**
 * ArtifactBar — horizontal scroll strip of studio desk artifacts.
 *
 * Objects at varied scales on the page surface. Subtle scale on hover.
 */
export default function ArtifactBar({ artifacts }: ArtifactBarProps) {
  const heights = ["45vh", "30vh", "38vh", "50vh", "28vh", "42vh"];

  if (artifacts.length === 0) {
    return (
      <div className="relative z-10 flex h-[66.67vh] items-center justify-center">
        <p
          className="font-sans text-ink-lighter italic"
          style={{ fontSize: "clamp(0.8rem, 1vw, 0.95rem)" }}
        >
          The desk is empty — check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="relative z-10 h-[66.67vh] pt-[2vh] pb-[11vh]">
      <div
        className="flex h-full items-end gap-[2vw] overflow-x-auto px-[3vw] scrollbar-hide"
        style={{ scrollSnapType: "x proximity" }}
      >
        {artifacts.map((artifact, i) => (
          <div
            key={artifact.slug}
            className="group relative flex-shrink-0"
            style={{ scrollSnapAlign: "start" }}
          >
            <Image
              src={artifact.image}
              alt={artifact.description || `Artifact from ${artifact.date}`}
              width={600}
              height={800}
              className="rounded-sm object-contain transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg"
              style={{ height: heights[i % heights.length], width: "auto" }}
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}
