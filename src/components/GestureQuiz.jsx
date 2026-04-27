import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  ArrowRight,
  Camera,
  CheckCircle2,
  Hand,
  HelpCircle,
  MousePointerClick,
  RotateCcw,
  Video,
  VideoOff,
  XCircle,
} from "lucide-react";
import BeforeAfterAral from "./BeforeAfterAral";
import { gestureQuestions } from "../utils/content";

const HAND_CONNECTIONS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  [0, 17],
];

const ANSWER_HOLD_FRAMES = 16;
const ANSWER_COOLDOWN = 1800;
const MEDIAPIPE_HANDS_PATH = `${import.meta.env.BASE_URL}mediapipe/hands/`;

const gestureTabs = [
  {
    id: "answer",
    label: "Сұрақтарға жауап беру",
    text: "1, 2 немесе 3 саусақпен тест жауабын таңдаңыз.",
    icon: HelpCircle,
  },
  {
    id: "compare",
    label: "Суретті қолмен жылжыту",
    text: "Сұқ саусақ салыстыру сызығын оңға және солға қозғайды.",
    icon: ArrowLeftRight,
  },
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getHandQuality(landmarks, handedness) {
  if (!landmarks?.length) {
    return { valid: false, reason: "Қолыңыз камерада толық көрінсін." };
  }

  const score = handedness?.score ?? 1;
  const palmSpan = distance(landmarks[5], landmarks[17]);
  const wristToMiddle = distance(landmarks[0], landmarks[9]);

  if (score < 0.68 || palmSpan < 0.045 || wristToMiddle < 0.065) {
    return { valid: false, reason: "Қолыңызды камераға жақынырақ әрі анық көрсетіңіз." };
  }

  if (palmSpan > 0.55) {
    return { valid: false, reason: "Қолыңызды камерадан сәл алыстатыңыз." };
  }

  return { valid: true, palmSpan, wristToMiddle, score };
}

function countAnswerFingers(landmarks, quality) {
  if (!quality.valid) return 0;

  const threshold = clamp(quality.palmSpan * 0.32, 0.026, 0.052);
  const fingers = [
    { tip: 8, pip: 6, mcp: 5 },
    { tip: 12, pip: 10, mcp: 9 },
    { tip: 16, pip: 14, mcp: 13 },
    { tip: 20, pip: 18, mcp: 17 },
  ];

  return fingers.reduce((sum, finger) => {
    const tip = landmarks[finger.tip];
    const pip = landmarks[finger.pip];
    const mcp = landmarks[finger.mcp];
    const wrist = landmarks[0];
    const raisedByHeight = tip.y < pip.y - threshold && tip.y < mcp.y - threshold * 0.72;
    const raisedByLength =
      distance(tip, wrist) > distance(pip, wrist) + quality.palmSpan * 0.12;

    return raisedByHeight && raisedByLength ? sum + 1 : sum;
  }, 0);
}

function getIndexPointer(landmarks, quality) {
  if (!quality.valid) return null;
  const indexTip = landmarks[8];
  const indexPip = landmarks[6];
  const threshold = clamp(quality.palmSpan * 0.24, 0.022, 0.045);
  const indexRaised = indexTip.y < indexPip.y - threshold;

  if (!indexRaised) return null;

  return {
    x: clamp(100 - indexTip.x * 100, 8, 92),
    y: clamp(indexTip.y * 100, 8, 92),
  };
}

function drawHand(canvas, landmarks, activeCount = 0) {
  const context = canvas.getContext("2d");
  const { width, height } = canvas;
  context.clearRect(0, 0, width, height);
  if (!landmarks?.length) return;

  context.save();
  context.translate(width, 0);
  context.scale(-1, 1);
  context.lineCap = "round";
  context.lineJoin = "round";

  HAND_CONNECTIONS.forEach(([start, end]) => {
    const a = landmarks[start];
    const b = landmarks[end];
    context.beginPath();
    context.moveTo(a.x * width, a.y * height);
    context.lineTo(b.x * width, b.y * height);
    context.strokeStyle = "rgba(255,255,255,0.72)";
    context.lineWidth = 5;
    context.stroke();
    context.strokeStyle = "rgba(15,131,189,0.94)";
    context.lineWidth = 2;
    context.stroke();
  });

  landmarks.forEach((point, index) => {
    const activeTips = [8, 12, 16].slice(0, activeCount);
    context.beginPath();
    context.arc(point.x * width, point.y * height, activeTips.includes(index) ? 8 : 5, 0, Math.PI * 2);
    context.fillStyle = activeTips.includes(index) ? "#ffffff" : "#5eead4";
    context.fill();
  });

  context.restore();
}

function getMediapipeExport(module, exportName) {
  return (
    module?.[exportName] ??
    module?.default?.[exportName] ??
    (typeof window !== "undefined" ? window[exportName] : undefined)
  );
}

function getCameraErrorMessage(error) {
  if (!window.isSecureContext) {
    return "Камера тек HTTPS немесе localhost арқылы іске қосылады. Сайтты https://... немесе http://localhost:5173 арқылы ашыңыз.";
  }

  if (error?.name === "NotAllowedError" || error?.name === "SecurityError") {
    return "Камераға рұқсат берілмеді. Браузердегі камера рұқсатын қосып, қайта басыңыз.";
  }

  if (error?.name === "NotFoundError" || error?.name === "DevicesNotFoundError") {
    return "Камера табылмады. Құрылғы камерасын қосып, бетті жаңартыңыз.";
  }

  if (error?.name === "NotReadableError" || error?.name === "TrackStartError") {
    return "Камераны басқа бағдарлама пайдаланып тұр. Басқа қолданбаны жауып, қайта көріңіз.";
  }

  return error?.message || "Камера қосылмады. Батырмамен де жауап беруге болады.";
}

async function createHandCamera(videoElement, onResults) {
  const [handsModule, cameraModule] = await Promise.all([
    import("@mediapipe/hands"),
    import("@mediapipe/camera_utils"),
  ]);
  const Hands = getMediapipeExport(handsModule, "Hands");
  const CameraRunner = getMediapipeExport(cameraModule, "Camera");

  if (!Hands || !CameraRunner) {
    throw new Error("Қол қимылын тану модулі жүктелмеді. Бетті жаңартып көріңіз.");
  }

  const hands = new Hands({
    locateFile: (file) => `${MEDIAPIPE_HANDS_PATH}${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 0,
    selfieMode: true,
    minDetectionConfidence: 0.68,
    minTrackingConfidence: 0.62,
  });
  hands.onResults(onResults);

  const camera = new CameraRunner(videoElement, {
    onFrame: async () => {
      if (videoElement.readyState >= 2) {
        await hands.send({ image: videoElement });
      }
    },
    width: 960,
    height: 720,
  });

  await camera.start();
  return { hands, camera };
}

function CameraPreview({
  videoRef,
  canvasRef,
  cameraReady,
  title,
  text,
  children,
}) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-[#071e26]">
      {!cameraReady && (
        <div className="absolute inset-0 z-10 grid place-items-center p-6 text-center">
          <div>
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-[8px] bg-white/10">
              <Camera size={38} />
            </div>
            <p className="mt-5 text-xl font-black">{title}</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/68">
              {text}
            </p>
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        className="camera-mirror h-full w-full object-cover opacity-82"
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        width="960"
        height="720"
        className="absolute inset-0 h-full w-full"
      />
      {children}
    </div>
  );
}

function useHandCamera({ onResults, onStopLog }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handsRef = useRef(null);
  const cameraRef = useRef(null);
  const mountedRef = useRef(false);
  const onStopLogRef = useRef(onStopLog);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const stopCamera = useCallback(() => {
    cameraRef.current?.stop?.();
    handsRef.current?.close?.();
    const stream = videoRef.current?.srcObject;
    stream?.getTracks?.().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    cameraRef.current = null;
    handsRef.current = null;
    setCameraActive(false);
    setCameraReady(false);
    setCameraStarting(false);
    onStopLogRef.current?.();
  }, []);

  const startCamera = useCallback(async () => {
    if (cameraStarting || cameraActive) return;
    setCameraError("");
    setCameraStarting(true);

    try {
      if (!window.isSecureContext) {
        throw new Error(getCameraErrorMessage({ name: "SecurityError" }));
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Бұл браузер камераны қолдамайды.");
      }
      if (!videoRef.current) {
        throw new Error("Камера терезесі дайын емес.");
      }

      const { hands, camera } = await createHandCamera(videoRef.current, onResults);
      if (!mountedRef.current || !videoRef.current) {
        camera.stop?.();
        hands.close?.();
        return;
      }
      handsRef.current = hands;
      cameraRef.current = camera;
      setCameraActive(true);
      setCameraReady(true);
    } catch (error) {
      stopCamera();
      setCameraError(getCameraErrorMessage(error));
    } finally {
      if (mountedRef.current) {
        setCameraStarting(false);
      }
    }
  }, [cameraActive, cameraStarting, onResults, stopCamera]);

  useEffect(() => {
    onStopLogRef.current = onStopLog;
  }, [onStopLog]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    cameraActive,
    cameraReady,
    cameraStarting,
    cameraError,
    startCamera,
    stopCamera,
  };
}

function GestureComparePanel() {
  const [split, setSplit] = useState(52);
  const [fingerCount, setFingerCount] = useState(0);
  const [gesturePoint, setGesturePoint] = useState(null);
  const [gestureLog, setGestureLog] = useState(
    "Камераны қосып, сұқ саусағыңызды оңға немесе солға жылжытыңыз.",
  );

  const handleResults = useCallback((results) => {
    const landmarks = results.multiHandLandmarks?.[0];
    const quality = getHandQuality(landmarks, results.multiHandedness?.[0]);
    const count = countAnswerFingers(landmarks, quality);
    const canvas = camera.canvasRef.current;
    if (canvas) drawHand(canvas, landmarks, count);

    if (!quality.valid) {
      setFingerCount(0);
      setGesturePoint(null);
      setGestureLog(quality.reason);
      return;
    }

    const pointer = getIndexPointer(landmarks, quality);
    setFingerCount(count);
    setGesturePoint(pointer);

    if (pointer) {
      const targetSplit = clamp(pointer.x, 18, 82);
      setSplit((current) => Math.round(current * 0.78 + targetSplit * 0.22));
      setGestureLog("Салыстыру сызығы қол қимылымен қозғалып тұр.");
    } else {
      setGestureLog("Сызықты жылжыту үшін сұқ саусақты анық көрсетіңіз.");
    }
  }, []);

  const camera = useHandCamera({
    onResults: handleResults,
    onStopLog: () => {
      setFingerCount(0);
      setGesturePoint(null);
    },
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42 }}
      >
        <BeforeAfterAral
          split={split}
          onSplitChange={setSplit}
          controlId="gestureBeforeAfter"
          gesturePoint={camera.cameraActive ? gesturePoint : null}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, duration: 0.42 }}
        className="card-radius overflow-hidden border border-white/18 bg-white/12 text-white shadow-soft backdrop-blur-md"
      >
        <div className="flex flex-col gap-3 border-b border-white/14 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-white text-aral-deep">
              <ArrowLeftRight size={21} />
            </span>
            <div>
              <p className="font-black">Салыстыру сызығын басқару</p>
              <p className="text-sm text-white/66">{gestureLog}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={camera.cameraActive ? camera.stopCamera : camera.startCamera}
            disabled={camera.cameraStarting}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] bg-white px-3 text-sm font-black text-aral-deep transition hover:bg-sand-50 disabled:cursor-wait disabled:opacity-70"
          >
            {camera.cameraActive ? <VideoOff size={17} /> : <Video size={17} />}
            {camera.cameraStarting
              ? "Камера қосылып жатыр"
              : camera.cameraActive
                ? "Камераны тоқтату"
                : "Камераны қосу"}
          </button>
        </div>

        <CameraPreview
          videoRef={camera.videoRef}
          canvasRef={camera.canvasRef}
          cameraReady={camera.cameraReady}
          title="Камера дайын"
          text="Сұқ саусағыңызды толық көрсетіңіз. Қол анық көрінгенде ғана сызық қозғалады."
        >
          <div className="absolute left-4 top-4 rounded-[8px] border border-white/24 bg-black/28 px-4 py-3 backdrop-blur-md">
            <p className="text-xs font-black uppercase text-white/66">
              Көрінген саусақ
            </p>
            <p className="mt-1 text-4xl font-black">{fingerCount}</p>
          </div>
          <div className="absolute bottom-4 left-4 right-4 rounded-[8px] bg-white/92 p-4 text-aral-deep shadow-soft">
            <div className="flex items-start gap-3">
              <MousePointerClick className="mt-1 shrink-0 text-aral-blue" size={22} />
              <div>
                <p className="text-sm font-black uppercase text-aral-deep/55">
                  Сызық орны
                </p>
                <p className="font-black">{split}%</p>
              </div>
            </div>
          </div>
        </CameraPreview>

        {camera.cameraError && (
          <div className="border-t border-aral-alert/30 bg-[#fff0ed] p-4 text-sm font-bold leading-6 text-aral-alert">
            {camera.cameraError}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function GestureAnswerPanel({ onAnswer }) {
  const stableRef = useRef({
    count: 0,
    frames: 0,
    lastEmit: 0,
    needsRelease: false,
  });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [fingerCount, setFingerCount] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const [gestureLog, setGestureLog] = useState(
    "Камераны қосып, бас бармақсыз 1, 2 немесе 3 саусақ көрсетіңіз.",
  );

  const currentQuestion = gestureQuestions[questionIndex];
  const selected = answers.find((item) => item.questionId === currentQuestion?.id);
  const correctCount = answers.filter((item) => item.correct).length;
  const finished = answers.length === gestureQuestions.length;
  const quizStateRef = useRef({ currentQuestion, selected, finished });
  const chooseOptionRef = useRef(null);

  useEffect(() => {
    quizStateRef.current = { currentQuestion, selected, finished };
  }, [currentQuestion, selected, finished]);

  const chooseOption = useCallback(
    (id, source = "button") => {
      if (!currentQuestion || finished) return;
      const option = currentQuestion.options.find((item) => item.id === id);
      if (!option || selected) return;

      setAnswers((current) => [
        ...current,
        {
          questionId: currentQuestion.id,
          optionId: option.id,
          label: option.label,
          correct: option.correct,
        },
      ]);
      setGestureLog(
        source === "gesture"
          ? `${id} саусақ тұрақты танылды: ${option.label}`
          : `Таңдау: ${option.label}`,
      );
      onAnswer?.(option.id);

      window.setTimeout(() => {
        setQuestionIndex((index) => Math.min(gestureQuestions.length - 1, index + 1));
        stableRef.current = {
          count: 0,
          frames: 0,
          lastEmit: Date.now(),
          needsRelease: true,
        };
        setHoldProgress(0);
      }, 1050);
    },
    [currentQuestion, finished, onAnswer, selected],
  );

  useEffect(() => {
    chooseOptionRef.current = chooseOption;
  }, [chooseOption]);

  const handleResults = useCallback(
    (results) => {
      const latest = quizStateRef.current;
      const landmarks = results.multiHandLandmarks?.[0];
      const quality = getHandQuality(landmarks, results.multiHandedness?.[0]);
      const count = countAnswerFingers(landmarks, quality);
      const canvas = camera.canvasRef.current;
      if (canvas) drawHand(canvas, landmarks, count);

      if (!quality.valid) {
        setFingerCount(0);
        setHoldProgress(0);
        stableRef.current.count = 0;
        stableRef.current.frames = 0;
        stableRef.current.needsRelease = false;
        setGestureLog(quality.reason);
        return;
      }

      setFingerCount(count);

      if (latest.finished) {
        setGestureLog("Тест аяқталды. Нәтиже төменде көрсетілді.");
        return;
      }

      if (latest.selected) {
        setGestureLog("Жауап қабылданды. Келесі сұрақ дайындалып жатыр.");
        return;
      }

      if (stableRef.current.needsRelease) {
        setHoldProgress(0);
        if (count === 0) {
          stableRef.current.needsRelease = false;
          setGestureLog("Келесі сұраққа дайын. Жауапты қайта көрсетіңіз.");
        } else {
          setGestureLog("Келесі сұрақ үшін қолыңызды бір сәт түсіріп, қайта көрсетіңіз.");
        }
        return;
      }

      if (count < 1 || count > 3) {
        setHoldProgress(0);
        stableRef.current.count = count;
        stableRef.current.frames = 0;
        if (count === 0) {
          stableRef.current.needsRelease = false;
        }
        setGestureLog("Жауап үшін дәл 1, 2 немесе 3 саусақ көрсетіңіз.");
        return;
      }

      const stable = stableRef.current;
      if (count === stable.count) {
        stable.frames += 1;
      } else {
        stable.count = count;
        stable.frames = 1;
      }

      const progress = clamp((stable.frames / ANSWER_HOLD_FRAMES) * 100, 0, 100);
      setHoldProgress(progress);
      setGestureLog(`${count} саусақ көрінді. Жауап қабылдануы үшін қолды сәл ұстап тұрыңыз.`);

      const now = Date.now();
      if (
        stable.frames >= ANSWER_HOLD_FRAMES &&
        now - stable.lastEmit > ANSWER_COOLDOWN
      ) {
        stable.lastEmit = now;
        chooseOptionRef.current?.(count, "gesture");
      }
    },
    [],
  );

  const camera = useHandCamera({
    onResults: handleResults,
    onStopLog: () => {
      setFingerCount(0);
      setHoldProgress(0);
    },
  });

  const resetTest = () => {
    setAnswers([]);
    setQuestionIndex(0);
    setFingerCount(0);
    setHoldProgress(0);
    stableRef.current = {
      count: 0,
      frames: 0,
      lastEmit: Date.now(),
      needsRelease: false,
    };
    setGestureLog("Камераны қосып, бас бармақсыз 1, 2 немесе 3 саусақ көрсетіңіз.");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <motion.div
        initial={{ opacity: 0, x: -22 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.42 }}
      >
        <p className="text-sm font-black uppercase text-sand-300">
          Қимыл тесті
        </p>
        <h3 className="mt-3 text-balance text-2xl font-black leading-tight md:text-4xl">
          Саусақпен жауап беретін сұрақтар
        </h3>
        <p className="mt-5 text-lg leading-8 text-white/78">
          Камера қолыңыздағы саусақ санын оқиды. Жауап қате қабылданбауы үшін
          қолыңызды толық көрсетіп, таңдаған саусақ санын бір сәт ұстап тұрыңыз.
          Бас бармақ есепке алынбайды.
        </p>

        <div className="mt-6 rounded-[8px] border border-white/22 bg-white/12 p-4 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-black uppercase text-sand-300">
              Сұрақ {Math.min(questionIndex + 1, gestureQuestions.length)} / {gestureQuestions.length}
            </p>
            <p className="text-sm font-bold text-white/72">
              Дұрыс жауап: {correctCount}
            </p>
          </div>
          <h4 className="mt-3 text-2xl font-black leading-tight">
            {finished ? "Тест аяқталды" : currentQuestion.question}
          </h4>
          <p className="mt-2 text-sm font-semibold leading-6 text-white/68">
            {finished
              ? `${correctCount} сұраққа дұрыс жауап бердіңіз.`
              : currentQuestion.hint}
          </p>
        </div>

        {!finished && (
          <div className="mt-5 grid gap-3">
            {currentQuestion.options.map((option) => {
              const active = selected?.optionId === option.id;
              const wrong = active && !option.correct;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => chooseOption(option.id)}
                  disabled={Boolean(selected)}
                  className={`card-radius min-h-24 border p-4 text-left transition hover:-translate-y-1 disabled:cursor-default ${
                    active
                      ? option.correct
                        ? "border-white bg-white text-aral-deep"
                        : "border-aral-alert bg-[#fff0ed] text-aral-alert"
                      : "border-white/24 bg-white/10 text-white backdrop-blur-md hover:bg-white/16"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-black uppercase">
                    <Hand size={17} />
                    {option.id} саусақ
                    {active && option.correct && <CheckCircle2 size={17} />}
                    {wrong && <XCircle size={17} />}
                  </span>
                  <span className="mt-3 block text-base font-bold leading-6">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {finished && (
          <div className="mt-5 rounded-[8px] border border-white/24 bg-white p-5 text-aral-deep shadow-soft">
            <p className="text-sm font-black uppercase text-aral-deep/55">
              Нәтиже
            </p>
            <p className="mt-2 text-4xl font-black">
              {correctCount} / {gestureQuestions.length}
            </p>
            <p className="mt-2 leading-7 text-aral-deep/72">
              Табиғатты қорғау нақты әдеттен басталады: суды үнемдеу, ағаш егу,
              қоқысты азайту және жақындарыңызға үлгі болу.
            </p>
            <button
              type="button"
              onClick={resetTest}
              className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] bg-aral-deep px-4 text-sm font-black text-white transition hover:-translate-y-1"
            >
              <RotateCcw size={17} />
              Қайта тапсыру
            </button>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.06, duration: 0.42 }}
        className="card-radius overflow-hidden border border-white/18 bg-white/12 text-white shadow-soft backdrop-blur-md"
      >
        <div className="flex flex-col gap-3 border-b border-white/14 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-white text-aral-deep">
              <Hand size={21} />
            </span>
            <div>
              <p className="font-black">Қолмен жауап беру</p>
              <p className="text-sm text-white/66">{gestureLog}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={camera.cameraActive ? camera.stopCamera : camera.startCamera}
              disabled={camera.cameraStarting}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] bg-white px-3 text-sm font-black text-aral-deep transition hover:bg-sand-50 disabled:cursor-wait disabled:opacity-70"
            >
              {camera.cameraActive ? <VideoOff size={17} /> : <Video size={17} />}
              {camera.cameraStarting
                ? "Камера қосылып жатыр"
                : camera.cameraActive
                  ? "Камераны тоқтату"
                  : "Камераны қосу"}
            </button>
          </div>
        </div>

        <CameraPreview
          videoRef={camera.videoRef}
          canvasRef={camera.canvasRef}
          cameraReady={camera.cameraReady}
          title="Камера дайын"
          text="Қолыңызды толық көрсетіңіз. Жауап қабылдануы үшін 1, 2 немесе 3 саусақты бір сәт ұстап тұрыңыз."
        >
          <div className="absolute left-4 top-4 rounded-[8px] border border-white/24 bg-black/38 px-4 py-3 backdrop-blur-md">
            <p className="text-xs font-black uppercase text-white/66">
              Көрінген саусақ
            </p>
            <p className="mt-1 text-4xl font-black">{fingerCount}</p>
          </div>
          <div className="absolute bottom-4 left-4 right-4 rounded-[8px] bg-white/92 p-4 text-aral-deep shadow-soft">
            <div className="flex items-start gap-3">
              {selected?.correct ? (
                <CheckCircle2 className="mt-1 shrink-0 text-aral-green" size={22} />
              ) : selected ? (
                <XCircle className="mt-1 shrink-0 text-aral-alert" size={22} />
              ) : (
                <MousePointerClick className="mt-1 shrink-0 text-aral-blue" size={22} />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black uppercase text-aral-deep/55">
                  {selected ? "Қабылданған жауап" : "Тұрақтылық"}
                </p>
                <p className="font-black">
                  {selected
                    ? selected.label
                    : `${Math.round(holdProgress)}%`}
                </p>
                {!selected && (
                  <div className="mt-2 h-2 overflow-hidden rounded-[8px] bg-aral-deep/12">
                    <div
                      className="h-full rounded-[8px] bg-aral-blue transition-all"
                      style={{ width: `${holdProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CameraPreview>

        {camera.cameraError && (
          <div className="border-t border-aral-alert/30 bg-[#fff0ed] p-4 text-sm font-bold leading-6 text-aral-alert">
            {camera.cameraError}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function GestureQuiz({ onAnswer }) {
  const [activeTab, setActiveTab] = useState("answer");

  return (
    <section id="gesture" className="section-shell relative overflow-hidden bg-aral-deep text-white">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-x-0 top-0 h-1/2 water-shimmer" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 cracked-ground" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,61,79,0.92),rgba(15,61,79,0.78)_45%,rgba(31,91,69,0.74))]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-7 max-w-3xl">
          <p className="text-sm font-black uppercase text-sand-300">
            Қимылмен басқару
          </p>
          <h2 className="mt-3 text-balance text-3xl font-black leading-tight md:text-5xl">
            Қолмен жауап беретін экологиялық тест
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/78">
            Әр бөлім жеке жұмыс істейді: алдымен сұрақтарға саусақпен жауап
            беріңіз, кейін суреттерді қолмен салыстырып көріңіз. Қол толық және
            тұрақты көрінгенде ғана жауап қабылданады.
          </p>
        </div>

        <div className="mb-7 grid gap-3 md:grid-cols-2" role="tablist" aria-label="Қимыл бөлімдері">
          {gestureTabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`card-radius border p-4 text-left transition hover:-translate-y-1 ${
                  active
                    ? "border-white bg-white text-aral-deep shadow-soft"
                    : "border-white/24 bg-white/10 text-white backdrop-blur-md hover:bg-white/16"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-[8px] ${
                      active ? "bg-aral-deep text-white" : "bg-white/14 text-white"
                    }`}
                  >
                    <Icon size={21} />
                  </span>
                  <span>
                    <span className="block font-black">{tab.label}</span>
                    <span className={`mt-1 block text-sm leading-6 ${active ? "text-aral-deep/64" : "text-white/68"}`}>
                      {tab.text}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {activeTab === "answer" ? (
          <GestureAnswerPanel onAnswer={onAnswer} />
        ) : (
          <GestureComparePanel />
        )}

        <div className="mt-8 flex justify-end">
          {activeTab === "answer" ? (
            <button
              type="button"
              onClick={() => setActiveTab("compare")}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] bg-white px-5 text-sm font-black text-aral-deep shadow-soft transition hover:-translate-y-1"
            >
              Суреттерді салыстыру
              <ArrowRight size={18} />
            </button>
          ) : (
            <a
              href="#actions"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] bg-white px-5 text-sm font-black text-aral-deep shadow-soft transition hover:-translate-y-1"
            >
              Келесі
              <ArrowRight size={18} />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
