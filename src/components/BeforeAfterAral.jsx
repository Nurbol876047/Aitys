import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { imageSlots } from "../utils/content";

const clampSplit = (value) => Math.min(82, Math.max(18, Number(value)));

export default function BeforeAfterAral({
  split: controlledSplit,
  onSplitChange,
  heightClass = "h-[340px] md:h-[480px]",
  className = "",
  controlId = "beforeAfter",
  showControl = true,
  gesturePoint,
}) {
  const [internalSplit, setInternalSplit] = useState(52);
  const split = controlledSplit ?? internalSplit;
  const splitStyle = useMemo(() => ({ "--split": `${split}%` }), [split]);

  const updateSplit = (value) => {
    const nextSplit = clampSplit(value);
    if (controlledSplit === undefined) {
      setInternalSplit(nextSplit);
    }
    onSplitChange?.(nextSplit);
  };

  return (
    <div className={`glass-panel card-radius overflow-hidden ${className}`}>
      <div className={`relative ${heightClass}`} style={splitStyle}>
        <div className="absolute inset-0 clip-before bg-aral-blue">
          <img
            src={imageSlots.before}
            alt="Арал теңізінің бұрынғы суға толы көрінісі"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-aral-deep/34 via-transparent to-white/4" />
          <p className="absolute bottom-4 left-4 rounded-[8px] bg-aral-deep/76 px-3 py-2 text-sm font-black text-white backdrop-blur">
            1. Арал теңізі бұрын
          </p>
        </div>

        <div className="absolute inset-0 clip-after bg-sand-500">
          <img
            src={imageSlots.now}
            alt="Арал теңізінің қазіргі құрғаған табаны"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3b261f]/42 via-transparent to-white/4" />
          <p className="absolute bottom-4 right-4 rounded-[8px] bg-[#3b261f]/78 px-3 py-2 text-sm font-black text-white backdrop-blur">
            2. Арал теңізі қазір
          </p>
        </div>

        {gesturePoint && (
          <div
            className="pointer-events-none absolute z-20 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-aral-blue/70 shadow-soft"
            style={{
              left: `${gesturePoint.x}%`,
              top: `${gesturePoint.y}%`,
            }}
            aria-hidden="true"
          />
        )}

        <div
          className="absolute bottom-0 top-0 z-10 w-[3px] bg-white shadow-[0_0_0_1px_rgba(15,61,79,0.18)]"
          style={{ left: `${split}%` }}
        >
          <div className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[8px] bg-white text-aral-deep shadow-soft">
            <ArrowLeftRight size={19} />
          </div>
        </div>
      </div>

      {showControl && (
        <div className="flex flex-col gap-3 border-t border-aral-deep/10 bg-white/80 p-4 md:flex-row md:items-center">
          <label htmlFor={controlId} className="text-sm font-black text-aral-deep">
            Бұрын / кейін әсері
          </label>
          <input
            id={controlId}
            type="range"
            min="18"
            max="82"
            value={split}
            onChange={(event) => updateSplit(event.target.value)}
            className="h-2 flex-1 accent-aral-blue"
            aria-label="Аралдың бұрынғы және қазіргі көрінісін салыстыру"
          />
        </div>
      )}
    </div>
  );
}
