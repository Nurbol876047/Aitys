import { motion } from "framer-motion";
import {
  BookOpenCheck,
  CalendarCheck,
  CheckCircle2,
  Droplets,
  HandMetal,
  Leaf,
  Recycle,
  RotateCcw,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { lessonMode, quizOptions } from "../utils/content";

const conclusionCards = [
  {
    title: "Судың қадірін түсіндік",
    text: "Арал тағдыры суды бейберекет пайдаланудың табиғатқа да, адамға да әсер ететінін көрсетеді.",
    icon: Droplets,
  },
  {
    title: "Жауапкершілік өзімізден басталады",
    text: "Кранды жабу, қоқысты азайту, ағаш егу сияқты шағын әдеттер үлкен өзгеріске жол ашады.",
    icon: ShieldCheck,
  },
  {
    title: "Табиғат үнін есту маңызды",
    text: "Айтыс арқылы табиғаттың ренішін, адамның мойындауын және дұрыс шешімге келуін көрдік.",
    icon: Leaf,
  },
];

const nextSteps = [
  {
    title: "Бүгін",
    text: "Үйде су үнемдеу ережесін келісіп, кранды бос ағызбауды бастаңыз.",
    icon: Droplets,
  },
  {
    title: "Осы аптада",
    text: "Қоқысты сұрыптап, пластик пен қағазды бөлек жинауға дағдыланыңыз.",
    icon: Recycle,
  },
  {
    title: "Осы айда",
    text: "Сыныппен немесе отбасыңызбен бір ағаш отырғызу жоспарын жасаңыз.",
    icon: CalendarCheck,
  },
  {
    title: "Әрдайым",
    text: "Арал туралы білгеніңізді достарыңызға айтып, табиғатты қорғауға үлгі болыңыз.",
    icon: Users,
  },
];

export default function FinalScreen({ answer, ecoScore, onReset }) {
  const selected = quizOptions.find((option) => option.id === answer);
  const resultTone =
    ecoScore >= 80
      ? "Тамаша нәтиже: таңдауларыңыз табиғатқа нақты қолдау көрсетеді."
      : ecoScore >= 40
        ? "Жақсы бастама: тағы бірнеше экологиялық әрекет қоссаңыз, әсер күшейеді."
        : "Бастауға әлі де мүмкіндік бар: бір дұрыс әдеттен үлкен өзгеріс басталады.";

  return (
    <section
      id="final"
      className="section-shell relative min-h-screen overflow-hidden bg-aral-deep text-white"
    >
      <div className="absolute inset-0 water-shimmer opacity-50" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,39,45,0.98),rgba(31,91,69,0.9)_42%,rgba(15,131,189,0.78))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.2),transparent_28%),radial-gradient(circle_at_12%_86%,rgba(217,189,130,0.24),transparent_32%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ y: 26 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch"
        >
          <div className="card-radius border border-white/20 bg-white/10 p-5 shadow-soft backdrop-blur-md md:p-8">
            <p className="text-sm font-black uppercase text-sand-300">
              Қорытынды
            </p>
            <h2 className="mt-3 text-balance text-4xl font-black leading-tight md:text-6xl">
              Арал бізге табиғатты қорғауды үйретеді
            </h2>
            <p className="mt-5 text-lg font-semibold leading-8 text-white/86">
              Бұл сабақта біз Арал теңізінің тартылуы жай ғана табиғи құбылыс
              емес, адамның шешімімен байланысты үлкен жауапкершілік екенін
              көрдік. Табиғатты қорғау алыс нәрсе емес: ол суды үнемдеуден,
              таза ортадан, дұрыс таңдау жасаудан басталады.
            </p>

            <div className="mt-6 grid gap-3">
              {conclusionCards.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="card-radius border border-white/20 bg-white/10 p-4 backdrop-blur-md"
                  >
                    <div className="flex gap-3">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] bg-white text-aral-deep">
                        <Icon size={21} />
                      </div>
                      <div>
                        <h3 className="font-black text-white">{item.title}</h3>
                        <p className="mt-1 text-sm font-medium leading-6 text-white/74">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onReset}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] bg-white px-5 text-base font-black text-aral-deep transition hover:-translate-y-1"
              >
                <RotateCcw size={19} />
                Қайта бастау
              </button>
              <a
                href="#lesson"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-white/30 bg-white/10 px-5 text-base font-black text-white transition hover:-translate-y-1 hover:bg-white/20"
              >
                <BookOpenCheck size={19} />
                Сабақ қорытындысы
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="card-radius border border-white/20 bg-white p-5 text-aral-deep shadow-soft md:p-6">
              <div className="flex items-center gap-3">
                <Trophy className="text-sand-500" size={28} />
                <p className="font-black">Эко ұпай</p>
              </div>
              <p className="mt-4 text-6xl font-black text-aral-blue">{ecoScore}%</p>
              <p className="mt-3 text-base font-bold leading-7 text-aral-deep/72">
                {resultTone}
              </p>
              <div className="mt-4 h-4 overflow-hidden rounded-[8px] bg-sand-100">
                <div
                  className="h-full rounded-[8px] bg-gradient-to-r from-aral-alert via-sand-500 to-aral-blue"
                  style={{ width: `${ecoScore}%` }}
                />
              </div>
            </div>

            <div className="card-radius border border-white/20 bg-white/10 p-5 shadow-soft backdrop-blur-md md:p-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-sand-300" size={27} />
                <p className="font-black">Айтыстағы таңдау</p>
              </div>
              <p className="mt-4 text-lg font-black leading-8 text-white">
                {selected
                  ? selected.label
                  : "Жауап таңдалмады. Бірақ табиғатты қорғауды кез келген сәтте бастауға болады."}
              </p>
              <p className="mt-3 text-sm font-medium leading-6 text-white/72">
                Дұрыс жауап табиғатқа құр сөзбен емес, нақты әрекетпен қолдау
                көрсету керектігін еске салады.
              </p>
            </div>

            <div className="card-radius border border-white/20 bg-white/10 p-5 shadow-soft backdrop-blur-md md:p-6">
              <p className="text-sm font-black uppercase text-sand-300">
                Негізгі ой
              </p>
              <p className="mt-3 text-2xl font-black leading-tight">
                Аралдың болашағы суды қалай пайдалануымызға, жерді қалай
                қорғауымызға және бүгін қандай әдет қалыптастыруымызға тәуелді.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          id="lesson"
          initial={{ y: 24 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <div className="card-radius border border-white/20 bg-white/10 p-5 shadow-soft backdrop-blur-md md:p-7">
            <p className="text-sm font-black uppercase text-sand-300">
              Сабақта қолдану
            </p>
            <h3 className="mt-3 text-2xl font-black text-white md:text-3xl">
              Қысқа түсіндірме
            </h3>
            <p className="mt-4 text-lg font-medium leading-8 text-white/78">
              Бұл бөлім оқушыға экологиялық мәселені сезінуге, себеп пен
              салдарды түсіндіруге, өз ойын таңдаумен дәлелдеуге және нақты
              әрекет жоспарын құруға көмектеседі.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {nextSteps.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="card-radius border border-white/20 bg-white/90 p-4 text-aral-deep shadow-sm backdrop-blur-md"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-sand-100 text-aral-green">
                    <Icon size={22} />
                  </div>
                  <h4 className="mt-4 font-black">{item.title}</h4>
                  <p className="mt-2 text-sm font-medium leading-6 text-aral-deep/70">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </motion.div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {lessonMode.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="card-radius border border-white/20 bg-white/10 p-4 text-white shadow-sm backdrop-blur-md"
              >
                <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-white text-aral-deep">
                  <Icon size={20} />
                </div>
                <p className="mt-3 font-black">{item.title}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 card-radius border border-white/20 bg-white/10 p-5 text-white shadow-sm backdrop-blur-md">
          <div className="flex items-start gap-3">
            <HandMetal className="mt-1 shrink-0 text-sand-300" size={23} />
            <p className="font-bold leading-7">
              Қорытынды: табиғатты қорғау бір үлкен ұраннан емес, күн сайын
              қайталанатын нақты әрекеттен басталады. Су үнемделсе, жер
              қорғалса, адам жауапкершілік танытса, Аралдың болашағына үміт
              қосылады.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
