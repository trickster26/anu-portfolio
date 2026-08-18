import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Capabilities } from "./components/Capabilities";
import { Work } from "./components/Work";
import { Tenancy } from "./components/Tenancy";
import { Experience } from "./components/Experience";
import { Stack } from "./components/Stack";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="grain min-h-[100dvh] bg-bg">
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-5 focus:z-[70] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-bg"
      >
        Skip to content
      </a>

      <Nav />

      <main>
        <Hero />
        <Capabilities />
        <Work />
        <Tenancy />
        <Experience />
        <Stack />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
