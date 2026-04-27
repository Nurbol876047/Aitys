import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, Menu } from "lucide-react";
import AitysDialogue from "./components/AitysDialogue";
import EcoActions from "./components/EcoActions";
import FinalScreen from "./components/FinalScreen";
import GestureQuiz from "./components/GestureQuiz";
import Hero from "./components/Hero";
import ProblemSection from "./components/ProblemSection";
import { quizOptions } from "./utils/content";

const navItems = [
  { href: "#intro", label: "Басты бет" },
  { href: "#problem", label: "Мәселе" },
  { href: "#aitys", label: "Айтыс" },
  { href: "#gesture", label: "Қимыл" },
  { href: "#actions", label: "Шешім" },
  { href: "#final", label: "Қорытынды" },
];

function App() {
  const [answer, setAnswer] = useState(null);
  const [ecoScore, setEcoScore] = useState(0);
  const [resetToken, setResetToken] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const chosenOption = useMemo(
    () => quizOptions.find((option) => option.id === answer),
    [answer],
  );

  const handleReset = () => {
    setAnswer(null);
    setEcoScore(0);
    setResetToken((value) => value + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen overflow-x-hidden text-aral-green">
      <header className="fixed left-0 right-0 top-0 z-50 px-4 py-3 md:px-6">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-[8px] border border-white/60 bg-white/76 px-3 py-2 shadow-soft backdrop-blur-xl">
          <a
            href="#intro"
            className="flex items-center gap-2 text-sm font-black uppercase text-aral-deep"
            onClick={() => setMenuOpen(false)}
          >
            <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-aral-deep text-white">
              А
            </span>
            Арал айтысы
          </a>
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-[8px] px-3 py-2 text-sm font-semibold text-aral-deep/75 transition hover:bg-sand-100 hover:text-aral-deep"
              >
                {item.label}
              </a>
            ))}
          </div>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-[8px] bg-sand-100 text-aral-deep md:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Мәзірді ашу"
          >
            <Menu size={20} />
          </button>
        </nav>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mx-auto mt-2 grid max-w-7xl gap-1 rounded-[8px] border border-white/70 bg-white/92 p-2 shadow-soft backdrop-blur-xl md:hidden"
            >
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-[8px] px-3 py-3 text-sm font-bold text-aral-deep"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <Hero />
        <ProblemSection />
        <AitysDialogue answer={answer} onAnswer={setAnswer} />
        <GestureQuiz
          answer={answer}
          chosenOption={chosenOption}
          onAnswer={setAnswer}
        />
        <EcoActions
          answer={answer}
          resetToken={resetToken}
          onScoreChange={setEcoScore}
        />
        <FinalScreen
          answer={answer}
          ecoScore={ecoScore}
          onReset={handleReset}
        />
      </main>

      <a
        href="#intro"
        className="fixed bottom-4 right-4 z-40 grid h-11 w-11 place-items-center rounded-[8px] bg-aral-deep text-white shadow-soft transition hover:-translate-y-1"
        aria-label="Жоғары көтерілу"
      >
        <ChevronUp size={20} />
      </a>
    </div>
  );
}

export default App;
