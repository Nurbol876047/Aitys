import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { heroCopy, imageSlots } from "../utils/content";

function FloatingTitle({ text }) {
  let letterIndex = 0;

  return (
    <span className="hero-title-3d" aria-label={text}>
      {text.split(" ").map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`}>
          <span className="hero-word" aria-hidden="true">
            {word.split("").map((letter) => {
              const delay = `${(letterIndex % 9) * 0.12}s`;
              letterIndex += 1;

              return (
                <span
                  className="hero-letter"
                  style={{ "--letter-delay": delay }}
                  key={`${letter}-${letterIndex}`}
                >
                  {letter}
                </span>
              );
            })}
          </span>
          {wordIndex < text.split(" ").length - 1 && (
            <span aria-hidden="true"> </span>
          )}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const goNext = () => {
    document.querySelector("#problem")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="intro"
      className="relative min-h-[calc(100vh+70px)] overflow-hidden bg-aral-deep text-white"
    >
      <img
        src={imageSlots.hero}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,28,31,0.72),rgba(8,39,45,0.42)_42%,rgba(15,61,79,0.06)_72%,rgba(8,39,45,0.22))]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,18,20,0.12),transparent_36%,rgba(5,28,31,0.28))]" />
      <div className="absolute inset-y-0 left-0 w-[58%] bg-[radial-gradient(ellipse_at_28%_50%,rgba(3,24,28,0.52),rgba(3,24,28,0.24)_42%,transparent_72%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-sand-50 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 pb-28 pt-28 md:px-8">
        <motion.div
          initial={{ y: 24 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-[8px] border border-white/30 bg-white/12 px-3 py-2 text-sm font-bold backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-aral-alert" />
            Әлемдік экология мәселелері
          </div>
          <h1 className="text-balance text-4xl font-black leading-tight md:text-6xl lg:text-7xl">
            <FloatingTitle text={heroCopy.title} />
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-white/84 md:text-2xl">
            {heroCopy.subtitle}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={goNext}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] bg-white px-6 py-3 text-base font-black text-aral-deep shadow-soft transition hover:-translate-y-1 hover:bg-sand-50"
            >
              <Play size={19} />
              {heroCopy.cta}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 22 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.45, duration: 0.75 }}
          className="mt-12 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {[
            ["Бұрын", "толқын, балық, тіршілік"],
            ["Қазір", "құрғақ табан, тұз, шаң"],
            ["Ертең", "адам таңдаған бағыт"],
          ].map(([title, text]) => (
            <div
              key={title}
              className="card-radius border border-white/28 bg-white/12 p-4 backdrop-blur-md"
            >
              <p className="text-sm font-black uppercase text-white">{title}</p>
              <p className="mt-1 text-sm leading-6 text-white/76">{text}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
