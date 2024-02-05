import { Badge } from "@/components/ui/badge";
// import icon from react-icons
import { TbBrandNextjs, TbBrandPrisma, TbBrandTypescript, TbBrandReact } from "react-icons/tb";
import { SiPostgresql } from "react-icons/si";
import { RxVercelLogo } from "react-icons/rx";

const technologyStack = [
  {
    icon: <TbBrandReact size={28} />,
    name: "React",
  },
  {
    icon: <TbBrandNextjs size={28} />,
    name: "Next.js",
  },
  {
    icon: <TbBrandPrisma size={28} />,
    name: "Prisma",
  },
  {
    icon: <TbBrandTypescript size={28} />,
    name: "TypeScript",
  },
  // Add more technologies as needed
  {
    icon: <SiPostgresql size={28} />,
    name: "PostgreSQL",
  },
  {
    icon: <RxVercelLogo size={28} />,
    name: "Vercel",
  },
];

export const Sponsors = () => {
  return (
    <section id="technology-stack" className="container pt-24 sm:py-28">
      <h2 className="text-center text-2xl lg:text-3xl font-bold mb-8 text-primary">Technology Stack</h2>

      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
        {technologyStack.map(({ icon, name }, index) => (
          <Badge key={index} className="flex items-center gap-2 bg-secondary p-2 rounded-md shadow-md">
            <span>{icon}</span>
            <h3 className="text-md font-bold">{name}</h3>
          </Badge>
        ))}
      </div>
    </section>
  );
};
