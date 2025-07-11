import { Play } from "lucide-react";
import { Button } from "@repo/ui/button";

const Hero = () => {
  return (
    <>
    <section className="relative h-screen bg-neutral-950 overflow-hidden flex items-center justify-center">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <div className="relative container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
          Draw. Collaborate.
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Create — Together.
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Instantly sketch, brainstorm, and prototype with your team in one
          shared canvas.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
          <Button variant="primary">Create Room</Button>
          <Button variant="secondary">Join Room</Button>
        </div>
      </div>
    </section>
    </>
  );
};

export default Hero;
