import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Droplets, Leaf, Sparkles } from "lucide-react";
import { ecoActions, imageSlots } from "../utils/content";

function RestorationVisual({ score }) {
  const waterLevel = Math.max(16, score);
  const greenOpacity = Math.min(1, score / 80);

  return (
    <div className="card-radius relative min-h-[420px] overflow-hidden border border-white/36 bg-white shadow-soft">
      <img
        src={imageSlots.actions}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,45,49,0.08),rgba(8,39,45,0.28)_58%,rgba(8,39,45,0.56))]" />
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-[linear-gradient(135deg,rgba(15,131,189,0.76),rgba(82,192,199,0.68))] shadow-insetBlue"
        animate={{ height: `${waterLevel}%` }}
        transition={{ type: "spring", stiffness: 80, damping: 18 }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: greenOpacity }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute bottom-[18%] left-[8%] h-24 w-24 rounded-full bg-aral-leaf/70 blur-md" />
        <div className="absolute bottom-[22%] right-[16%] h-32 w-32 rounded-full bg-aral-green/60 blur-lg" />
        <div className="absolute bottom-[42%] left-[42%] h-20 w-20 rounded-full bg-[#83b85d]/60 blur-md" />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-aral-deep/34 via-transparent to-white/8" />
      <div className="absolute left-5 top-5 rounded-[8px] bg-white/90 px-4 py-3 text-aral-deep shadow-soft backdrop-blur">
        <p className="text-xs font-black uppercase text-aral-deep/55">
          Аралдың жағдайы
        </p>
        <p className="mt-1 text-4xl font-black">{score}%</p>
      </div>

      <div className="absolute bottom-5 left-5 right-5 rounded-[8px] bg-white/90 p-4 text-aral-deep shadow-soft backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-aral-green text-white">
            {score >= 80 ? <Sparkles size={22} /> : <Droplets size={22} />}
          </div>
          <div>
            <p className="font-black">
              {score >= 80
                ? "Табиғатты қорғау — әр адамның міндеті"
                : "Әр дұрыс әрекет суды қайта жақындатады"}
            </p>
            <p className="mt-1 text-sm leading-6 text-aral-deep/66">
              Шешім көбейген сайын су деңгейі, жарық және жасыл өмір визуалды
              түрде өзгереді.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EcoActions({ answer, resetToken, onScoreChange }) {
  const [selectedActions, setSelectedActions] = useState([]);

  useEffect(() => {
    setSelectedActions([]);
  }, [resetToken]);

  const score = useMemo(
    () => Math.min(100, selectedActions.length * 20),
    [selectedActions],
  );

  useEffect(() => {
    onScoreChange(score);
  }, [onScoreChange, score]);

  const toggleAction = (id) => {
    setSelectedActions((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return (
    <section id="actions" className="section-shell relative overflow-hidden bg-aral-deep">
      <img
        src={imageSlots.actions}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,31,34,0.76),rgba(8,39,45,0.44)_48%,rgba(255,247,225,0.34))]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,31,34,0.18),rgba(255,250,240,0.22)_48%,rgba(6,31,34,0.2))]" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        <motion.div
          initial={{ y: 24 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <p className="text-sm font-black uppercase text-sand-300">
            Экологиялық шешімдер
          </p>
          <h2 className="mt-3 text-balance text-3xl font-black leading-tight text-white md:text-5xl">
            Табиғатқа әсер ететін таңдауларды жаса
          </h2>
          <p className="mt-5 text-lg font-medium leading-8 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
            Аралды бір күнде қалпына келтіру мүмкін емес, бірақ әр дұрыс шешім
            болашақтың бағытын өзгертеді. Әр әрекет эко ұпайды көтеріп,
            визуалда судың қайта оралуын көрсетеді.
          </p>

          <div className="mt-6 rounded-[8px] border border-white/50 bg-white/90 p-4 shadow-soft backdrop-blur-md">
            <div className="flex items-center justify-between gap-4">
              <p className="font-black text-aral-deep">Аралдың жағдайы</p>
              <p className="text-2xl font-black text-aral-blue">{score}%</p>
            </div>
            <div className="mt-3 h-4 overflow-hidden rounded-[8px] bg-sand-100">
              <motion.div
                className="h-full rounded-[8px] bg-gradient-to-r from-aral-alert via-sand-500 to-aral-blue"
                animate={{ width: `${score}%` }}
                transition={{ type: "spring", stiffness: 90, damping: 18 }}
              />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {ecoActions.map((action) => {
              const Icon = action.icon;
              const active = selectedActions.includes(action.id);

              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => toggleAction(action.id)}
                  className={`card-radius group min-h-36 border p-4 text-left transition hover:-translate-y-1 ${
                    active
                      ? "border-aral-green bg-[#eef8ef]/90 shadow-soft"
                      : "border-white/50 bg-white/90 backdrop-blur-md hover:border-aral-blue/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-[8px] bg-sand-100 text-aral-green transition group-hover:bg-aral-green group-hover:text-white">
                      <Icon size={23} />
                    </div>
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-[8px] border ${
                        active
                          ? "border-aral-green bg-aral-green text-white"
                          : "border-aral-deep/15 text-transparent"
                      }`}
                    >
                      <Check size={18} />
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-black text-aral-deep">
                    {action.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-aral-deep/68">
                    {action.text}
                  </p>
                </button>
              );
            })}
          </div>

          {!answer && (
            <div className="mt-4 flex gap-3 rounded-[8px] border border-white/50 bg-white/90 p-4 text-aral-alert shadow-sm backdrop-blur-md">
              <Leaf className="mt-1 shrink-0" size={20} />
              <p className="text-sm font-bold leading-6">
                Айтыста жауап таңдамасаңыз да, шешімдер бөлімі жұмыс істейді.
                Толық сценарий үшін жоғарыдағы сұраққа жауап беріп көріңіз.
              </p>
            </div>
          )}
          <a
            href="#final"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] bg-white px-5 text-sm font-black text-aral-deep shadow-soft transition hover:-translate-y-1"
          >
            Келесі
            <ArrowRight size={18} />
          </a>
        </motion.div>

        <motion.div
          initial={{ scale: 0.96 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.18 }}
        >
          <RestorationVisual score={score} />
        </motion.div>
      </div>
    </section>
  );
}
