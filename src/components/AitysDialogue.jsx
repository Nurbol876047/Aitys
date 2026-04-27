import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Leaf,
  MessageCircle,
  Sparkles,
  UserRound,
  UsersRound,
  Volume2,
  XCircle,
} from "lucide-react";
import {
  aitysLines,
  aitysTypes,
  imageSlots,
  quizOptions,
  quizQuestion,
  reactions,
} from "../utils/content";

function CharacterStage() {
  return (
    <div className="card-radius relative min-h-[520px] overflow-hidden border border-white/24 bg-aral-deep shadow-soft">
      <img
        src={imageSlots.natureHuman}
        alt="Табиғат пен Адам бір-біріне қарап сөйлесіп тұрған көрініс"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,39,45,0.22),rgba(15,61,79,0.04),rgba(80,45,28,0.25))]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-aral-deep/82 to-transparent" />

      <div className="absolute left-4 top-4 rounded-[8px] border border-white/28 bg-aral-green/72 px-4 py-3 text-white backdrop-blur-md">
        <p className="text-xs font-black uppercase text-white/66">Сол жақ</p>
        <p className="text-lg font-black">Табиғат</p>
      </div>
      <div className="absolute right-4 top-4 rounded-[8px] border border-white/28 bg-aral-deep/76 px-4 py-3 text-right text-white backdrop-blur-md">
        <p className="text-xs font-black uppercase text-white/66">Оң жақ</p>
        <p className="text-lg font-black">Адам</p>
      </div>

      <div className="absolute bottom-4 left-4 right-4 rounded-[8px] border border-white/24 bg-white/12 p-4 text-white backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-white text-aral-deep">
            <Sparkles size={20} />
          </span>
          <div>
            <p className="font-black">Мәтіндік айтыс сахнасы</p>
            <p className="text-sm leading-6 text-white/72">
              Әр шумақ табиғат жағдайын және адамның жауапкершілігін мәтін
              арқылы көрсетеді.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DialogueBubble({ line, index, onPlayFrom }) {
  const isNature = line.speaker === "Табиғат";

  const handlePlay = () => {
    if (onPlayFrom) {
      onPlayFrom(index);
    } else {
      if (window.currentAitysAudio) {
        window.currentAitysAudio.pause();
        window.currentAitysAudio.currentTime = 0;
      }
      const audio = new Audio(`/audio/line_${index}.mp3`);
      window.currentAitysAudio = audio;
      audio.play().catch(console.error);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.42 }}
      className={`card-radius max-w-[920px] border p-4 shadow-soft md:p-5 ${
        isNature
          ? "mr-auto border-aral-green/16 bg-white"
          : "ml-auto border-aral-blue/18 bg-[#eef8fb]"
      }`}
    >
      <div className="flex gap-3">
        <div
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-[8px] text-white ${
            isNature ? "bg-aral-green" : "bg-aral-deep"
          }`}
        >
          {isNature ? <Leaf size={22} /> : <UserRound size={22} />}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-black text-aral-deep">
                {line.speaker}
              </h3>
              <span className="rounded-[8px] bg-sand-100 px-2 py-1 text-xs font-black uppercase text-aral-deep/65">
                {line.mood}
              </span>
              <span className="text-xs font-bold text-aral-deep/45">
                шумақ {index + 1}
              </span>
            </div>
            <button
              onClick={handlePlay}
              className="rounded-[8px] bg-white/50 p-2 text-aral-deep/50 transition hover:bg-aral-blue/10 hover:text-aral-blue"
              title="Дауыстап оқу"
            >
              <Volume2 size={20} />
            </button>
          </div>
          <p className="mt-2 text-lg font-semibold leading-8 text-aral-deep/82">
            {line.text}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

function ResultPanel({ selected }) {
  if (!selected) return null;
  const isPositive = selected.correct;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card-radius mt-5 border p-4 ${
        isPositive
          ? "border-aral-green/25 bg-[#edf7ed] text-aral-green"
          : "border-aral-alert/30 bg-[#fff0ed] text-aral-alert"
      }`}
    >
      <div className="flex gap-3">
        {isPositive ? (
          <CheckCircle2 className="mt-1 shrink-0" size={22} />
        ) : (
          <XCircle className="mt-1 shrink-0" size={22} />
        )}
        <div>
          <p className="font-black">
            {isPositive ? "Табиғаттың жауабы" : "Табиғаттың ескертуі"}
          </p>
          <p className="mt-1 leading-7">
            {isPositive ? reactions.positive : reactions.warning}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

const typeIcons = [Sparkles, UsersRound, MessageCircle, BookOpen];

function AitysTypesGrid() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.48 }}
      className="mt-10"
    >
      <div className="max-w-3xl">
        <p className="text-sm font-black uppercase text-aral-blue">
          Айтыстың түрлері
        </p>
        <h3 className="mt-2 text-balance text-2xl font-black leading-tight text-aral-deep md:text-4xl">
          Қазақ айтысындағы негізгі үлгілер
        </h3>
        <p className="mt-4 text-lg leading-8 text-aral-deep/72">
          Айтыс тек ақындардың жарысы емес, ол салт-дәстүрді, білімді,
          тапқырлықты және қоғамдық ойды жеткізетін ауыз әдебиеті үлгісі.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {aitysTypes.map((type, index) => {
          const Icon = typeIcons[index % typeIcons.length];

          return (
            <article
              key={type.title}
              className="card-radius border border-white/60 bg-white/84 p-5 shadow-sm backdrop-blur-md"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] bg-aral-deep text-white">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-aral-green/72">
                    {type.category}
                  </p>
                  <h4 className="mt-1 text-lg font-black text-aral-deep">
                    {type.title}
                  </h4>
                </div>
              </div>
              <p className="mt-4 leading-7 text-aral-deep/72">{type.text}</p>
            </article>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function AitysDialogue({ answer, onAnswer }) {
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  const playSequence = async (startIndex = 0) => {
    window.currentAitysIsPlayingAll = false;
    if (window.currentAitysAudio) {
      window.currentAitysAudio.pause();
      window.currentAitysAudio.currentTime = 0;
    }
    
    // Кішкене кідіріс (алдыңғы цикл үзілуі үшін)
    await new Promise((resolve) => setTimeout(resolve, 50));

    setIsPlayingAll(true);
    window.currentAitysIsPlayingAll = true;

    for (let i = startIndex; i < aitysLines.length; i++) {
      if (!window.currentAitysIsPlayingAll) break;

      const audio = new Audio(`/audio/line_${i}.mp3`);
      window.currentAitysAudio = audio;

      await new Promise((resolve) => {
        audio.onended = resolve;
        audio.onerror = resolve;
        audio.play().catch((err) => {
          console.error("Audio play error:", err);
          resolve();
        });
      });

      // 1 секунд кідіріс (задержка 1 секунда)
      if (i < aitysLines.length - 1 && window.currentAitysIsPlayingAll) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (window.currentAitysIsPlayingAll) {
      setIsPlayingAll(false);
      window.currentAitysIsPlayingAll = false;
    }
  };

  const handlePlayAll = () => {
    if (isPlayingAll) {
      window.currentAitysIsPlayingAll = false;
      if (window.currentAitysAudio) {
        window.currentAitysAudio.pause();
        window.currentAitysAudio.currentTime = 0;
      }
      setIsPlayingAll(false);
    } else {
      playSequence(0);
    }
  };

  const selected = quizOptions.find((option) => option.id === answer);

  const choose = (option) => {
    onAnswer(option.id);
  };

  return (
    <section
      id="aitys"
      className="section-shell relative overflow-hidden bg-[#dfeee6]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#e7f2ea_0%,#d6ebe4_46%,#f0e5c9_100%)]" />
      <div className="absolute inset-x-0 top-0 h-56 bg-[linear-gradient(180deg,rgba(15,61,79,0.16),rgba(15,61,79,0))]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(120deg,rgba(15,61,79,0.18)_1px,transparent_1px),linear-gradient(60deg,rgba(31,91,69,0.12)_1px,transparent_1px)] [background-size:96px_96px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-7 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="lg:sticky lg:top-28"
          >
            <p className="text-sm font-black uppercase text-aral-blue">
              Интерактивті айтыс
            </p>
            <h2 className="mt-3 text-balance text-3xl font-black leading-tight text-aral-deep md:text-5xl">
              Табиғат пен Адам бір сахнада сөйлейді
            </h2>
            <p className="mt-5 text-lg leading-8 text-aral-deep/74">
              Айтыс форматы мәселені тек факт ретінде емес, жауапкершілік
              ретінде сезіндіреді. Әр шумақтан кейін адамның таңдауы табиғаттың
              реакциясын өзгертеді.
            </p>
            <div className="mt-6">
              <button
                onClick={handlePlayAll}
                className="inline-flex items-center gap-2 rounded-[8px] bg-aral-green px-5 py-3 text-sm font-black text-white shadow-soft transition hover:-translate-y-1 hover:bg-aral-deep"
              >
                <Volume2 size={20} />
                {isPlayingAll ? "Тыңдауды тоқтату" : "Диалогты толық тыңдау"}
              </button>
            </div>
            <div className="mt-8">
              <CharacterStage />
            </div>
          </motion.div>

          <div>
            <div className="grid gap-4">
              {aitysLines.map((line, index) => (
                <DialogueBubble
                  key={`${line.speaker}-${line.text}`}
                  line={line}
                  index={index}
                  onPlayFrom={playSequence}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 }}
              className="glass-panel card-radius mt-6 p-4 md:p-6"
            >
              <h3 className="text-xl font-black text-aral-deep">
                {quizQuestion}
              </h3>
              <div className="mt-4 grid gap-3">
                {quizOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => choose(option)}
                    className={`card-radius flex min-h-14 items-center gap-3 border p-4 text-left transition hover:-translate-y-1 ${
                      answer === option.id
                        ? "border-aral-blue bg-[#e8f6fb]"
                        : "border-aral-deep/10 bg-white hover:border-aral-blue/40"
                    }`}
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-aral-deep text-sm font-black text-white">
                      {option.id}
                    </span>
                    <span>
                      <span className="block font-black text-aral-deep">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-sm font-semibold text-aral-deep/52">
                        {option.tone}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              <ResultPanel selected={selected} />
              <div className="mt-5 flex justify-end">
                <a
                  href="#gesture"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] bg-aral-deep px-5 text-sm font-black text-white shadow-soft transition hover:-translate-y-1"
                >
                  Келесі
                  <ArrowRight size={18} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        <AitysTypesGrid />
      </div>
    </section>
  );
}
