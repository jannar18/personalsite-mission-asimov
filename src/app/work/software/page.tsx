import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllSoftwareProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Software",
  description:
    "Software portfolio — products, tools, and experiments in code and AI.",
};

export default function SoftwarePage() {
  const projects = getAllSoftwareProjects();

  return (
    <div className="mx-auto px-[5vw]">
      <div className="py-24">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-x-16 md:gap-y-10">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/work/software/${project.slug}`}
              className="group flex flex-col md:flex-row md:gap-6"
            >
              {/* Text — right side on md+ */}
              <div className="order-2 mt-4 flex flex-col justify-between text-left md:order-2 md:mt-0 md:w-[25%] md:flex-shrink-0 md:py-4">
                <h2 className="text-xl font-light text-ink transition-colors group-hover:text-scarlet">
                  {project.title}
                </h2>
                {project.description && (
                  <p className="mt-2 text-sm leading-relaxed text-ink-light">
                    {project.description}
                  </p>
                )}
                {project.stack && (
                  <ul className="mt-3 space-y-0.5">
                    {project.stack.map((tech) => (
                      <li key={tech} className="font-mono text-xs text-ink-lighter">
                        {tech}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Image — right side on md+ */}
              {(project.thumbImage || project.heroImage) && (
                <div className="relative order-1 aspect-[3/2] overflow-hidden bg-surface md:order-1 md:flex-1">
                  <Image
                    src={project.thumbImage ?? project.heroImage!}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    style={project.thumbPosition ? { objectPosition: project.thumbPosition } : undefined}
                  />
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
