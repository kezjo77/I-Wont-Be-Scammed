import { ShieldCheck, House, BookOpen, Megaphone, ListChecks } from "lucide-react";
import type { Route } from "@/lib/router";

interface HeaderProps {
  route: Route;
  onNavigate: (r: Route) => void;
}

const NAV: { route: Route; label: string; icon: typeof House }[] = [
  { route: "home", label: "Check a Message", icon: House },
  { route: "learn", label: "Learn About Scams", icon: BookOpen },
  { route: "report", label: "Report a Scam", icon: Megaphone },
  { route: "patterns", label: "Scam Patterns", icon: ListChecks },
];

export default function Header({ route, onNavigate }: HeaderProps) {
  return (
    <header className="bg-navy border-b-4 border-gold shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <button
            type="button"
            onClick={() => onNavigate("home")}
            aria-label="Go to home"
            className="flex items-center justify-center bg-gold rounded-3xl p-5 shadow-lg shrink-0 hover:bg-gold-light transition"
          >
            <ShieldCheck className="w-16 h-16 sm:w-20 sm:h-20 text-navy" strokeWidth={2.5} />
          </button>
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-warmgray tracking-tight leading-tight">
              I Wont Be Scammed
            </h1>
            <p className="mt-2 sm:mt-3 text-xl sm:text-2xl text-gold font-medium leading-snug">
              Easy safety checks for your texts, calls, and emails.
            </p>
          </div>
        </div>

        <nav className="mt-6 sm:mt-8 flex flex-wrap gap-3 justify-center sm:justify-start">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = route === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => onNavigate(item.route)}
                className={`flex items-center gap-2.5 px-5 py-3.5 rounded-xl text-lg sm:text-xl font-bold border-4 transition ${
                  active
                    ? "bg-gold border-gold-dark text-navy shadow-md"
                    : "bg-navy-light border-gold/40 text-warmgray hover:border-gold hover:bg-navy-light"
                }`}
              >
                <Icon className="w-6 h-6" strokeWidth={2.5} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
