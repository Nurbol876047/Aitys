import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import BeforeAfterAral from "./BeforeAfterAral";
import ThreeProblemTitle from "./ThreeProblemTitle";
import { problemAdvice, problemCards, problemCopy } from "../utils/content";

export default function ProblemSection() {
  return (
    <section id="problem" className="section-shell relative overflow-hidden bg-sand-50">
      <img
        src="/images/aral-problem-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,247,237,0.94),rgba(251,247,237,0.78)_48%,rgba(251,247,237,0.58))]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,247,237,0.9),rgba(251,247,237,0.58)_44%,rgba(251,247,237,0.88))]" />

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
          <p className="mt-5 text-lg leading-8 text-aral-deep/78">
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
                      <p className="mt-1 leading-7 text-aral-deep/72">
                        {card.text}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
          <div className="mt-6 rounded-[8px] border border-aral-green/16 bg-white/78 p-4 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase text-aral-green">
                  Нақты кеңестер
                </p>
                <h3 className="mt-1 text-xl font-black text-aral-deep">
                  Табиғатқа бүгін көмектесудің жолдары
                </h3>
              </div>
              <p className="text-sm font-bold text-aral-deep/55">
                Кішкентай әрекет тұрақты әдетке айналсын.
              </p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {problemAdvice.map((advice) => {
                const Icon = advice.icon;

                return (
                  <article
                    key={advice.title}
                    className="card-radius border border-aral-deep/8 bg-sand-50 p-4"
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
          <BeforeAfterAral />
        </motion.div>
      </div>
    </section>
  );
}
