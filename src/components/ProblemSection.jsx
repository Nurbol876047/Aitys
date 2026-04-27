import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ThreeProblemTitle from "./ThreeProblemTitle";
import { problemAdvice, problemCards, problemCopy } from "../utils/content";

export default function ProblemSection() {
  return (
    <section id="problem" className="section-shell relative overflow-hidden bg-sand-50">

      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.94fr_1.06fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65 }}
        >
          <p className="text-sm font-black uppercase text-aral-alert">
            Арал теңізі мәселесі
          </p>
          <ThreeProblemTitle />
          <p className="mt-5 text-lg font-medium leading-8 text-aral-deep/80 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
            {problemCopy}
          </p>
          <div className="mt-6 grid gap-3">
            {problemCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ delay: index * 0.08, duration: 0.48 }}
                  className="card-radius border border-aral-deep/10 bg-white p-4 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[8px] bg-sand-100 text-aral-blue">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-aral-deep">
                        {card.title}
                      </h3>
                      <p className="mt-1 leading-7 text-aral-deep/70">
                        {card.text}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
          <div className="mt-6 rounded-[8px] border border-aral-green/20 bg-white/90 p-4 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase text-aral-green">
                  Нақты кеңестер
                </p>
                <h3 className="mt-1 text-xl font-black text-aral-deep">
                  Табиғатқа бүгін көмектесудің жолдары
                </h3>
              </div>
              <p className="text-sm font-bold text-aral-deep/60">
                Кішкентай әрекет тұрақты әдетке айналсын.
              </p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {problemAdvice.map((advice) => {
                const Icon = advice.icon;

                return (
                  <article
                    key={advice.title}
                    className="card-radius border border-aral-deep/10 bg-sand-50 p-4"
                  >
                    <div className="flex gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-aral-green text-white">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-black text-aral-deep">
                          {advice.title}
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-aral-deep/70">
                          {advice.text}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
          <a
            href="#aitys"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] bg-aral-deep px-5 text-sm font-black text-white shadow-soft transition hover:-translate-y-1"
          >
            Келесі
            <ArrowRight size={18} />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.72 }}
        >
          <div className="card-radius overflow-hidden border border-aral-deep/10 shadow-soft">
            <img
              src={`${import.meta.env.BASE_URL}images/aral_problem_bg_single.png`}
              alt="Құрғаған Арал теңізіндегі кеме"
              className="aspect-[4/3] w-full object-cover lg:aspect-auto lg:h-[680px]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
