import { person } from "../content";

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="font-display text-[15px] font-medium tracking-tight text-text">
          {person.name}
        </p>
        <p className="text-[13px] text-dim">
          {person.role}. {person.location}.
        </p>
      </div>
    </footer>
  );
}
