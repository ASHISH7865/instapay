import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { HeroCards } from "./HeroCards";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-3xl md:text-4xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#d96419] via-[#de671d] to-[#93420f] text-transparent bg-clip-text">
              Instapay
            </span>{" "}
            E-Wallet App
          </h1>{" "}
          for{" "}
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#d96419] via-[#cf5f19] to-[#93420f] text-transparent bg-clip-text">
              Instant
            </span>{" "}
            Transactions
          </h2>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Seamlessly manage your finances with Instapay. Experience secure and instant transactions on the go.
        </p>

        <Button variant={"default"} className="mt-8">
          <Link href={"/sign-up"}>Get started</Link>
        </Button>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
