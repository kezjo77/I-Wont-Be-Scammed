import Header from "@/components/Header";
import HomePage from "@/pages/HomePage";
import LearnPage from "@/pages/LearnPage";
import ReportPage from "@/pages/ReportPage";
import PatternsPage from "@/pages/PatternsPage";
import { useHashRoute } from "@/lib/router";

export default function App() {
  const [route, navigate] = useHashRoute();

  return (
    <div className="min-h-screen bg-warmgray text-navy flex flex-col">
      <Header route={route} onNavigate={navigate} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {route === "home" && <HomePage />}
        {route === "learn" && <LearnPage />}
        {route === "report" && <ReportPage />}
        {route === "patterns" && <PatternsPage />}
      </main>

      <footer className="bg-navy text-warmgray py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-lg font-medium">I Wont Be Scammed — AI Scam Shield</p>
          <p className="text-base text-warmgray/70 mt-2">
            This tool gives general guidance only. When in doubt, ask a trusted family member or call
            the official number you already know.
          </p>
        </div>
      </footer>
    </div>
  );
}
