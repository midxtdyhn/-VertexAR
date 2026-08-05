import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Bell,
  Check,
  ChevronDown,
  Clock3,
  Coffee,
  Music2,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  Volume2,
  X,
} from "lucide-react";


const STORAGE_KEYS = {
  studySeconds: "vertexar-study-seconds",
  reminderMinutes: "vertexar-reminder-minutes",
  nextReminderAt: "vertexar-next-reminder-at",
  volume: "vertexar-break-volume",
  soundMode: "vertexar-break-sound",
};

const DEFAULT_REMINDER_MINUTES = 30;

const REMINDER_PRESETS = [
  5,
  15,
  30,
  45,
  60,
];

const SOUND_OPTIONS = [
  {
    id: "tenang",
    label: "Nada Tenang",
  },
  {
    id: "chime",
    label: "Chime Santai",
  },
  {
    id: "hening",
    label: "Tanpa Musik",
  },
];

const MOTIVATION_MESSAGES = [
  "Kamu sudah belajar dengan fokus. Istirahat singkat dapat membantu mata dan pikiran kembali segar.",
  "Hebat, progresmu terus bertambah. Tarik napas dan regangkan tubuh sebelum melanjutkan.",
  "Belajar giat itu keren, tetapi tubuh juga perlu jeda. Gunakan waktu istirahat untuk minum air.",
  "Kamu sudah melakukan pekerjaan yang baik. Jeda singkat dapat membuat sesi berikutnya lebih nyaman.",
  "Tetap semangat. Istirahat sejenak adalah bagian dari belajar dengan sehat.",
];


const COMPONENT_STYLES = `
  .vertex-focus {
    position: relative;
    z-index: 1800;
    flex: 0 0 auto;
    font-family: "Poppins", system-ui, sans-serif;
  }

  .vertex-focus *,
  .vertex-focus *::before,
  .vertex-focus *::after {
    box-sizing: border-box;
  }

  .vertex-focus button,
  .vertex-focus input,
  .vertex-focus select {
    font: inherit;
  }

  .vertex-focus__trigger {
    width: 178px;
    height: 56px;
    padding: 7px 10px;
    display: flex;
    align-items: center;
    gap: 9px;
    border: 1px solid #d7e8fb;
    border-radius: 18px;
    color: #073f91;
    background:
      linear-gradient(
        145deg,
        #ffffff,
        #f1f8ff
      );
    box-shadow:
      0 8px 22px rgba(10, 67, 145, 0.12);
    cursor: pointer;
    transition:
      transform 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease;
  }

  .vertex-focus__trigger:hover {
    transform: translateY(-2px);
    border-color: #9dc6f5;
    box-shadow:
      0 12px 28px rgba(10, 67, 145, 0.18);
  }

  .vertex-focus__trigger--open {
    border-color: #3985df;
    box-shadow:
      0 0 0 4px rgba(57, 133, 223, 0.12),
      0 12px 28px rgba(10, 67, 145, 0.16);
  }

  .vertex-focus__trigger--break {
    color: #ffffff;
    border-color: transparent;
    background:
      linear-gradient(
        135deg,
        #1268d8,
        #073b91
      );
  }

  .vertex-focus__trigger-icon {
    width: 38px;
    height: 38px;
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 13px;
    color: #0d58ba;
    background: #e7f3ff;
  }

  .vertex-focus__trigger--break
  .vertex-focus__trigger-icon {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.16);
  }

  .vertex-focus__trigger-copy {
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.05;
  }

  .vertex-focus__trigger-copy strong {
    color: inherit;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.02em;
  }

  .vertex-focus__trigger-copy small {
    margin-top: 5px;
    color: inherit;
    font-size: 9px;
    font-weight: 600;
    opacity: 0.72;
    white-space: nowrap;
  }

  .vertex-focus__trigger-chevron {
    margin-left: auto;
    flex: 0 0 auto;
    transition: transform 180ms ease;
  }

  .vertex-focus__trigger-chevron--open {
    transform: rotate(180deg);
  }

  .vertex-focus__panel {
    position: fixed;
    top: 94px;
    right: 28px;
    width: min(392px, calc(100vw - 32px));
    max-height: calc(100vh - 116px);
    padding: 18px;
    overflow-x: hidden;
    overflow-y: auto;
    border: 1px solid #dbe8f8;
    border-radius: 26px;
    color: #17385f;
    background: #ffffff;
    box-shadow:
      0 28px 72px rgba(7, 44, 96, 0.25);
    animation:
      vertex-focus-panel-in 220ms ease both;
  }

  @keyframes vertex-focus-panel-in {
    from {
      opacity: 0;
      transform:
        translateY(-12px)
        scale(0.97);
    }

    to {
      opacity: 1;
      transform:
        translateY(0)
        scale(1);
    }
  }

  .vertex-focus__panel-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .vertex-focus__heading {
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .vertex-focus__heading-icon {
    width: 44px;
    height: 44px;
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 15px;
    color: #ffffff;
    background:
      linear-gradient(
        135deg,
        #1a73de,
        #073b91
      );
    box-shadow:
      0 10px 22px rgba(18, 99, 207, 0.24);
  }

  .vertex-focus__heading small {
    display: block;
    color: #4f7cb3;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .vertex-focus__heading h3 {
    margin: 3px 0 0;
    color: #0b438f;
    font-size: 20px;
    line-height: 1.2;
  }

  .vertex-focus__close {
    width: 34px;
    height: 34px;
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 11px;
    color: #315a8d;
    background: #eef5fe;
    cursor: pointer;
    transition:
      background 160ms ease,
      transform 160ms ease;
  }

  .vertex-focus__close:hover {
    background: #e1efff;
    transform: rotate(5deg);
  }

  .vertex-focus__hero {
    margin-top: 16px;
    padding: 18px;
    border: 1px solid #dbeafb;
    border-radius: 22px;
    background:
      radial-gradient(
        circle at top right,
        rgba(89, 171, 255, 0.22),
        transparent 46%
      ),
      linear-gradient(
        140deg,
        #eef7ff,
        #f9fcff
      );
  }

  .vertex-focus__hero > span {
    color: #6782a5;
    font-size: 10px;
    font-weight: 700;
  }

  .vertex-focus__hero > strong {
    display: block;
    margin-top: 3px;
    color: #083f8f;
    font-size: 34px;
    font-weight: 800;
    letter-spacing: 0.04em;
  }

  .vertex-focus__hero-footer {
    margin-top: 11px;
    padding-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top:
      1px solid rgba(89, 137, 194, 0.16);
    color: #6781a1;
    font-size: 10px;
  }

  .vertex-focus__hero-footer b {
    color: #1359ad;
    font-size: 11px;
  }

  .vertex-focus__quick-actions {
    margin-top: 12px;
    display: grid;
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
    gap: 9px;
  }

  .vertex-focus__quick-actions button {
    min-height: 41px;
    padding: 9px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    border: 1px solid #dce7f4;
    border-radius: 13px;
    color: #22558f;
    background: #ffffff;
    cursor: pointer;
    font-size: 10px;
    font-weight: 700;
    transition:
      background 160ms ease,
      border-color 160ms ease,
      transform 160ms ease;
  }

  .vertex-focus__quick-actions button:hover {
    transform: translateY(-1px);
    border-color: #a8c9ee;
    background: #f4f9ff;
  }

  .vertex-focus__section {
    margin-top: 12px;
    padding: 15px;
    border: 1px solid #dce9f7;
    border-radius: 19px;
    background: #fbfdff;
    animation:
      vertex-focus-section-in 180ms ease both;
  }

  @keyframes vertex-focus-section-in {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .vertex-focus__section-title {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .vertex-focus__section-title > span {
    width: 35px;
    height: 35px;
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 12px;
    color: #0d5bc2;
    background: #eaf4ff;
  }

  .vertex-focus__section-title div {
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .vertex-focus__section-title strong {
    color: #164a87;
    font-size: 12px;
  }

  .vertex-focus__section-title small {
    margin-top: 2px;
    color: #7287a3;
    font-size: 9px;
    line-height: 1.4;
  }

  .vertex-focus__preset-grid {
    margin-top: 12px;
    display: grid;
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
    gap: 7px;
  }

  .vertex-focus__preset {
    min-height: 36px;
    padding: 7px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    border: 1px solid #d8e5f3;
    border-radius: 11px;
    color: #486888;
    background: #ffffff;
    cursor: pointer;
    font-size: 9px;
    font-weight: 700;
    transition:
      background 150ms ease,
      color 150ms ease,
      border-color 150ms ease;
  }

  .vertex-focus__preset:hover {
    border-color: #9fc4ef;
    background: #f0f7ff;
  }

  .vertex-focus__preset--active {
    color: #ffffff;
    border-color: #0e5fc8;
    background:
      linear-gradient(
        135deg,
        #176fd8,
        #074291
      );
  }

  .vertex-focus__custom {
    margin-top: 13px;
  }

  .vertex-focus__custom > label {
    display: block;
    margin-bottom: 7px;
    color: #4f6888;
    font-size: 9px;
    font-weight: 700;
  }

  .vertex-focus__custom-row {
    display: grid;
    grid-template-columns:
      minmax(0, 1fr)
      auto
      auto;
    align-items: center;
    gap: 7px;
  }

  .vertex-focus__custom input {
    width: 100%;
    height: 39px;
    padding: 0 10px;
    border: 1px solid #cfdff0;
    border-radius: 11px;
    color: #173f70;
    background: #ffffff;
    outline: none;
  }

  .vertex-focus__custom input:focus {
    border-color: #438adf;
    box-shadow:
      0 0 0 3px rgba(67, 138, 223, 0.12);
  }

  .vertex-focus__custom-row > span {
    color: #7286a1;
    font-size: 9px;
    font-weight: 700;
  }

  .vertex-focus__custom button {
    height: 39px;
    padding: 0 12px;
    border: 0;
    border-radius: 11px;
    color: #ffffff;
    background: #0c55b5;
    cursor: pointer;
    font-size: 9px;
    font-weight: 800;
  }

  .vertex-focus__custom > small {
    display: block;
    margin-top: 6px;
    color: #8696ab;
    font-size: 8px;
  }

  .vertex-focus__field {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .vertex-focus__field > span {
    color: #526b89;
    font-size: 9px;
    font-weight: 700;
  }

  .vertex-focus__field select {
    width: 100%;
    height: 39px;
    padding: 0 10px;
    border: 1px solid #d1dfef;
    border-radius: 11px;
    color: #173f70;
    background: #ffffff;
    outline: none;
    font-size: 10px;
    font-weight: 600;
  }

  .vertex-focus__field input[type="range"] {
    width: 100%;
    accent-color: #0d5cc4;
    cursor: pointer;
  }

  .vertex-focus__actions {
    margin-top: 13px;
    display: grid;
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .vertex-focus__button {
    min-height: 42px;
    padding: 9px 11px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    border-radius: 13px;
    cursor: pointer;
    font-size: 10px;
    font-weight: 800;
    transition:
      transform 150ms ease,
      box-shadow 150ms ease;
  }

  .vertex-focus__button:hover {
    transform: translateY(-1px);
  }

  .vertex-focus__button--primary {
    color: #ffffff;
    border: 1px solid transparent;
    background:
      linear-gradient(
        135deg,
        #176fd8,
        #074291
      );
    box-shadow:
      0 8px 18px rgba(12, 83, 181, 0.2);
  }

  .vertex-focus__button--secondary {
    color: #18529a;
    border: 1px solid #bcd5f1;
    background: #edf6ff;
  }

  .vertex-focus__reset {
    width: 100%;
    margin-top: 12px;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border: 0;
    color: #8292a7;
    background: transparent;
    cursor: pointer;
    font-size: 9px;
    font-weight: 700;
  }

  .vertex-focus__reset:hover {
    color: #d14d62;
  }

  .vertex-focus__overlay {
    position: fixed;
    inset: 0;
    z-index: 2600;
    padding: 20px;
    display: grid;
    place-items: center;
    background: rgba(3, 24, 56, 0.52);
    backdrop-filter: blur(6px);
    animation:
      vertex-focus-fade-in 200ms ease both;
  }

  @keyframes vertex-focus-fade-in {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  .vertex-focus__modal {
    width: min(480px, 100%);
    padding: 30px;
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 30px;
    color: #18385f;
    text-align: center;
    background:
      radial-gradient(
        circle at top right,
        rgba(76, 161, 255, 0.16),
        transparent 43%
      ),
      #ffffff;
    box-shadow:
      0 34px 90px rgba(5, 35, 78, 0.34);
    animation:
      vertex-focus-modal-in 240ms ease both;
  }

  @keyframes vertex-focus-modal-in {
    from {
      opacity: 0;
      transform:
        translateY(20px)
        scale(0.96);
    }

    to {
      opacity: 1;
      transform:
        translateY(0)
        scale(1);
    }
  }

  .vertex-focus__modal-bell {
    width: 70px;
    height: 70px;
    margin: 0 auto 15px;
    display: grid;
    place-items: center;
    border-radius: 23px;
    color: #ffffff;
    background:
      linear-gradient(
        135deg,
        #1a75de,
        #063b8c
      );
    box-shadow:
      0 14px 30px rgba(17, 95, 199, 0.28);
    animation:
      vertex-focus-bell 1.8s ease-in-out infinite;
  }

  @keyframes vertex-focus-bell {
    0%,
    100% {
      transform: rotate(0deg);
    }

    10% {
      transform: rotate(8deg);
    }

    20% {
      transform: rotate(-8deg);
    }

    30% {
      transform: rotate(5deg);
    }

    40% {
      transform: rotate(-5deg);
    }

    50% {
      transform: rotate(0deg);
    }
  }

  .vertex-focus__modal-label {
    color: #4f7cb2;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }

  .vertex-focus__modal h2 {
    margin: 8px 0 10px;
    color: #0a428f;
    font-size: clamp(24px, 4vw, 31px);
    line-height: 1.22;
  }

  .vertex-focus__modal > p {
    max-width: 390px;
    margin: 0 auto;
    color: #617a99;
    font-size: 13px;
    line-height: 1.7;
  }

  .vertex-focus__modal-time {
    width: fit-content;
    margin: 19px auto;
    padding: 11px 16px;
    display: flex;
    align-items: center;
    gap: 9px;
    border: 1px solid #d9e8f9;
    border-radius: 15px;
    color: #587392;
    background: #f3f9ff;
  }

  .vertex-focus__modal-time span {
    font-size: 9px;
    font-weight: 700;
  }

  .vertex-focus__modal-time strong {
    color: #0c4d9e;
    font-size: 15px;
  }

  .vertex-focus__modal-actions {
    display: grid;
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
    gap: 9px;
  }

  .vertex-focus__modal-continue {
    grid-column: 1 / -1;
    min-height: 39px;
    border: 0;
    color: #6a7f9a;
    background: transparent;
    cursor: pointer;
    font-size: 10px;
    font-weight: 700;
  }

  .vertex-focus__modal-continue:hover {
    color: #0d56b7;
  }

  .vertex-focus button:focus-visible,
  .vertex-focus input:focus-visible,
  .vertex-focus select:focus-visible {
    outline: 3px solid rgba(44, 126, 224, 0.23);
    outline-offset: 2px;
  }

  @media (max-width: 1250px) {
    .vertex-focus__trigger {
      width: 56px;
      padding: 8px;
      justify-content: center;
    }

    .vertex-focus__trigger-copy,
    .vertex-focus__trigger-chevron {
      display: none;
    }
  }

  @media (max-width: 760px) {
    .vertex-focus__panel {
      top: 82px;
      right: 16px;
      width: calc(100vw - 32px);
      max-height: calc(100vh - 102px);
      border-radius: 22px;
    }

    .vertex-focus__modal {
      padding: 24px 18px;
      border-radius: 24px;
    }

    .vertex-focus__modal-actions,
    .vertex-focus__actions {
      grid-template-columns: 1fr;
    }

    .vertex-focus__modal-continue {
      grid-column: auto;
    }
  }

  @media (max-width: 430px) {
    .vertex-focus__preset-grid {
      grid-template-columns:
        repeat(2, minmax(0, 1fr));
    }

    .vertex-focus__custom-row {
      grid-template-columns:
        minmax(0, 1fr)
        auto;
    }

    .vertex-focus__custom-row > span {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .vertex-focus__panel,
    .vertex-focus__section,
    .vertex-focus__overlay,
    .vertex-focus__modal,
    .vertex-focus__modal-bell {
      animation: none;
    }

    .vertex-focus__trigger,
    .vertex-focus__button,
    .vertex-focus__quick-actions button {
      transition: none;
    }
  }
`;


function readStoredNumber(
  key,
  fallbackValue
) {
  try {
    const value = Number(
      window.localStorage.getItem(key)
    );

    return Number.isFinite(value)
      ? value
      : fallbackValue;
  } catch {
    return fallbackValue;
  }
}


function formatTime(
  totalSeconds
) {
  const safeSeconds = Math.max(
    0,
    Math.floor(totalSeconds)
  );

  const hours = Math.floor(
    safeSeconds / 3600
  );

  const minutes = Math.floor(
    (safeSeconds % 3600) / 60
  );

  const seconds =
    safeSeconds % 60;

  if (hours > 0) {
    return [
      hours,
      minutes,
      seconds,
    ]
      .map((value) =>
        String(value).padStart(
          2,
          "0"
        )
      )
      .join(":");
  }

  return [
    minutes,
    seconds,
  ]
    .map((value) =>
      String(value).padStart(
        2,
        "0"
      )
    )
    .join(":");
}


function StudyBreakReminder() {
  const wrapperRef = useRef(null);
  const audioContextRef = useRef(null);
  const soundTimerRef = useRef(null);
  const gainRef = useRef(null);

  const [
    mounted,
    setMounted,
  ] = useState(false);

  const [
    studySeconds,
    setStudySeconds,
  ] = useState(0);

  const [
    reminderMinutes,
    setReminderMinutes,
  ] = useState(
    DEFAULT_REMINDER_MINUTES
  );

  const [
    nextReminderAt,
    setNextReminderAt,
  ] = useState(
    DEFAULT_REMINDER_MINUTES * 60
  );

  const [
    panelOpen,
    setPanelOpen,
  ] = useState(false);

  const [
    settingsOpen,
    setSettingsOpen,
  ] = useState(false);

  const [
    reminderOpen,
    setReminderOpen,
  ] = useState(false);

  const [
    breakSeconds,
    setBreakSeconds,
  ] = useState(0);

  const [
    timerPaused,
    setTimerPaused,
  ] = useState(false);

  const [
    customMinutes,
    setCustomMinutes,
  ] = useState(
    String(
      DEFAULT_REMINDER_MINUTES
    )
  );

  const [
    soundMode,
    setSoundMode,
  ] = useState("tenang");

  const [
    soundPlaying,
    setSoundPlaying,
  ] = useState(false);

  const [
    volume,
    setVolume,
  ] = useState(0.28);

  const [
    motivationMessage,
    setMotivationMessage,
  ] = useState(
    MOTIVATION_MESSAGES[0]
  );

  const isBreakActive =
    breakSeconds > 0;

  const secondsUntilReminder =
    Math.max(
      0,
      nextReminderAt
      - studySeconds
    );

  const soundLabel = useMemo(
    () =>
      SOUND_OPTIONS.find(
        (option) =>
          option.id === soundMode
      )?.label
      || SOUND_OPTIONS[0].label,
    [soundMode]
  );

  useEffect(() => {
    setMounted(true);

    const savedStudySeconds =
      Math.max(
        0,
        readStoredNumber(
          STORAGE_KEYS.studySeconds,
          0
        )
      );

    const savedReminderMinutes =
      Math.min(
        180,
        Math.max(
          1,
          readStoredNumber(
            STORAGE_KEYS.reminderMinutes,
            DEFAULT_REMINDER_MINUTES
          )
        )
      );

    const savedNextReminderAt =
      readStoredNumber(
        STORAGE_KEYS.nextReminderAt,
        savedStudySeconds
        + savedReminderMinutes * 60
      );

    const savedVolume =
      Math.min(
        1,
        Math.max(
          0,
          readStoredNumber(
            STORAGE_KEYS.volume,
            0.28
          )
        )
      );

    const savedSoundMode =
      window.localStorage.getItem(
        STORAGE_KEYS.soundMode
      );

    setStudySeconds(
      savedStudySeconds
    );

    setReminderMinutes(
      savedReminderMinutes
    );

    setCustomMinutes(
      String(
        savedReminderMinutes
      )
    );

    setNextReminderAt(
      Math.max(
        savedStudySeconds + 1,
        savedNextReminderAt
      )
    );

    setVolume(
      savedVolume
    );

    if (
      SOUND_OPTIONS.some(
        (option) =>
          option.id
          === savedSoundMode
      )
    ) {
      setSoundMode(
        savedSoundMode
      );
    }
  }, []);

  useEffect(() => {
    if (
      !mounted
      || timerPaused
      || isBreakActive
    ) {
      return undefined;
    }

    const intervalId =
      window.setInterval(() => {
        if (
          document.visibilityState
          === "visible"
        ) {
          setStudySeconds(
            (currentSeconds) =>
              currentSeconds + 1
          );
        }
      }, 1000);

    return () => {
      window.clearInterval(
        intervalId
      );
    };
  }, [
    isBreakActive,
    mounted,
    timerPaused,
  ]);

  useEffect(() => {
    if (
      !mounted
      || !isBreakActive
    ) {
      return undefined;
    }

    const intervalId =
      window.setInterval(() => {
        setBreakSeconds(
          (currentSeconds) => {
            if (
              currentSeconds <= 1
            ) {
              return 0;
            }

            return (
              currentSeconds - 1
            );
          }
        );
      }, 1000);

    return () => {
      window.clearInterval(
        intervalId
      );
    };
  }, [
    isBreakActive,
    mounted,
  ]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEYS.studySeconds,
      String(studySeconds)
    );

    window.localStorage.setItem(
      STORAGE_KEYS.reminderMinutes,
      String(reminderMinutes)
    );

    window.localStorage.setItem(
      STORAGE_KEYS.nextReminderAt,
      String(nextReminderAt)
    );

    window.localStorage.setItem(
      STORAGE_KEYS.volume,
      String(volume)
    );

    window.localStorage.setItem(
      STORAGE_KEYS.soundMode,
      soundMode
    );
  }, [
    mounted,
    nextReminderAt,
    reminderMinutes,
    soundMode,
    studySeconds,
    volume,
  ]);

  useEffect(() => {
    if (
      !mounted
      || isBreakActive
      || reminderOpen
      || studySeconds
        < nextReminderAt
    ) {
      return;
    }

    const messageIndex =
      Math.floor(
        studySeconds
        / Math.max(
          1,
          reminderMinutes * 60
        )
      )
      % MOTIVATION_MESSAGES.length;

    setMotivationMessage(
      MOTIVATION_MESSAGES[
        messageIndex
      ]
    );

    setReminderOpen(true);
    setPanelOpen(false);
  }, [
    isBreakActive,
    mounted,
    nextReminderAt,
    reminderMinutes,
    reminderOpen,
    studySeconds,
  ]);

  useEffect(() => {
    if (
      breakSeconds === 0
      && soundPlaying
    ) {
      stopSound();
    }
  }, [
    breakSeconds,
    soundPlaying,
  ]);

  useEffect(() => {
    if (
      gainRef.current
    ) {
      gainRef.current.gain.value =
        Math.max(
          0,
          Math.min(
            0.35,
            volume * 0.35
          )
        );
    }
  }, [volume]);

  useEffect(() => {
    function closeOutside(event) {
      if (
        wrapperRef.current
        && !wrapperRef.current.contains(
          event.target
        )
      ) {
        setPanelOpen(false);
        setSettingsOpen(false);
      }
    }

    function closeWithEscape(event) {
      if (event.key === "Escape") {
        setPanelOpen(false);
        setSettingsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      closeOutside
    );

    document.addEventListener(
      "keydown",
      closeWithEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        closeOutside
      );

      document.removeEventListener(
        "keydown",
        closeWithEscape
      );

      stopSound();
    };
  }, []);

  function scheduleNextReminder(
    minutes = reminderMinutes
  ) {
    setNextReminderAt(
      studySeconds
      + minutes * 60
    );
  }

  function createNote(
    frequency,
    duration,
    waveType
  ) {
    const audioContext =
      audioContextRef.current;

    const masterGain =
      gainRef.current;

    if (
      !audioContext
      || !masterGain
    ) {
      return;
    }

    const oscillator =
      audioContext.createOscillator();

    const noteGain =
      audioContext.createGain();

    oscillator.type = waveType;
    oscillator.frequency.value =
      frequency;

    const now =
      audioContext.currentTime;

    noteGain.gain.setValueAtTime(
      0,
      now
    );

    noteGain.gain.linearRampToValueAtTime(
      0.7,
      now + 0.08
    );

    noteGain.gain.exponentialRampToValueAtTime(
      0.001,
      now + duration
    );

    oscillator.connect(
      noteGain
    );

    noteGain.connect(
      masterGain
    );

    oscillator.start(now);
    oscillator.stop(
      now + duration + 0.05
    );
  }

  async function startSound() {
    if (
      soundMode === "hening"
    ) {
      setSoundPlaying(false);
      return;
    }

    stopSound();

    const AudioContextClass =
      window.AudioContext
      || window.webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    const audioContext =
      new AudioContextClass();

    const masterGain =
      audioContext.createGain();

    masterGain.gain.value =
      Math.max(
        0,
        Math.min(
          0.35,
          volume * 0.35
        )
      );

    masterGain.connect(
      audioContext.destination
    );

    audioContextRef.current =
      audioContext;

    gainRef.current =
      masterGain;

    await audioContext.resume();

    const pattern =
      soundMode === "chime"
        ? [
            523.25,
            659.25,
            783.99,
            659.25,
          ]
        : [
            261.63,
            329.63,
            392,
            329.63,
          ];

    const duration =
      soundMode === "chime"
        ? 1.1
        : 1.8;

    const interval =
      soundMode === "chime"
        ? 800
        : 1300;

    const waveType =
      soundMode === "chime"
        ? "sine"
        : "triangle";

    let noteIndex = 0;

    createNote(
      pattern[noteIndex],
      duration,
      waveType
    );

    soundTimerRef.current =
      window.setInterval(() => {
        noteIndex =
          (
            noteIndex + 1
          )
          % pattern.length;

        createNote(
          pattern[noteIndex],
          duration,
          waveType
        );
      }, interval);

    setSoundPlaying(true);
  }

  function stopSound() {
    if (
      soundTimerRef.current
    ) {
      window.clearInterval(
        soundTimerRef.current
      );

      soundTimerRef.current =
        null;
    }

    if (
      audioContextRef.current
    ) {
      audioContextRef.current.close();
      audioContextRef.current =
        null;
    }

    gainRef.current = null;
    setSoundPlaying(false);
  }

  function startBreak(minutes) {
    setReminderOpen(false);
    setBreakSeconds(
      minutes * 60
    );
    setPanelOpen(true);

    window.setTimeout(() => {
      startSound();
    }, 50);
  }

  function finishBreak() {
    setBreakSeconds(0);
    stopSound();
    scheduleNextReminder();
  }

  function continueStudy() {
    setReminderOpen(false);
    scheduleNextReminder();
  }

  function applyReminderMinutes(
    minutes
  ) {
    const safeMinutes =
      Math.min(
        180,
        Math.max(
          1,
          Number(minutes)
        )
      );

    setReminderMinutes(
      safeMinutes
    );

    setCustomMinutes(
      String(
        safeMinutes
      )
    );

    setNextReminderAt(
      studySeconds
      + safeMinutes * 60
    );

    setSettingsOpen(false);
  }

  function submitCustomReminder(
    event
  ) {
    event.preventDefault();

    const value =
      Number(customMinutes);

    if (
      !Number.isFinite(value)
      || value < 1
      || value > 180
    ) {
      return;
    }

    applyReminderMinutes(value);
  }

  function resetTimer() {
    setStudySeconds(0);
    setReminderOpen(false);
    setBreakSeconds(0);
    setTimerPaused(false);
    setNextReminderAt(
      reminderMinutes * 60
    );
    stopSound();

    window.localStorage.removeItem(
      STORAGE_KEYS.studySeconds
    );

    window.localStorage.removeItem(
      STORAGE_KEYS.nextReminderAt
    );
  }

  function handleSoundChange(
    event
  ) {
    const nextMode =
      event.target.value;

    const wasPlaying =
      soundPlaying;

    stopSound();
    setSoundMode(
      nextMode
    );

    if (
      wasPlaying
      && nextMode !== "hening"
    ) {
      window.setTimeout(() => {
        startSound();
      }, 50);
    }
  }

  if (!mounted) {
    return null;
  }

  return (
    <>
      <style>
        {COMPONENT_STYLES}
      </style>

      <div
        className="vertex-focus"
        ref={wrapperRef}
      >
        <button
          type="button"
          className={[
            "vertex-focus__trigger",
            panelOpen
              ? "vertex-focus__trigger--open"
              : "",
            isBreakActive
              ? "vertex-focus__trigger--break"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() =>
            setPanelOpen(
              (currentValue) =>
                !currentValue
            )
          }
          aria-label="Buka VertexAR Focus"
          aria-expanded={panelOpen}
        >
          <span className="vertex-focus__trigger-icon">
            {isBreakActive ? (
              <Coffee size={18} />
            ) : (
              <Bell size={18} />
            )}
          </span>

          <span className="vertex-focus__trigger-copy">
            <strong>
              {formatTime(
                isBreakActive
                  ? breakSeconds
                  : studySeconds
              )}
            </strong>

            <small>
              {isBreakActive
                ? "Sedang istirahat"
                : "Waktu belajar"}
            </small>
          </span>

          <ChevronDown
            size={16}
            className={[
              "vertex-focus__trigger-chevron",
              panelOpen
                ? "vertex-focus__trigger-chevron--open"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        </button>

        {panelOpen && (
          <section
            className="vertex-focus__panel"
            aria-label="Panel VertexAR Focus"
          >
            <div className="vertex-focus__panel-top">
              <div className="vertex-focus__heading">
                <span className="vertex-focus__heading-icon">
                  <Clock3 size={19} />
                </span>

                <div>
                  <small>
                    VertexAR Focus
                  </small>

                  <h3>
                    {isBreakActive
                      ? "Waktu istirahat"
                      : "Sesi belajarmu"}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                className="vertex-focus__close"
                onClick={() =>
                  setPanelOpen(false)
                }
                aria-label="Tutup panel"
              >
                <X size={18} />
              </button>
            </div>

            <div className="vertex-focus__hero">
              <span>
                {isBreakActive
                  ? "Sisa waktu istirahat"
                  : timerPaused
                    ? "Timer sedang dijeda"
                    : "Total waktu belajar"}
              </span>

              <strong>
                {formatTime(
                  isBreakActive
                    ? breakSeconds
                    : studySeconds
                )}
              </strong>

              {!isBreakActive && (
                <div className="vertex-focus__hero-footer">
                  <span>
                    Pengingat berikutnya
                  </span>

                  <b>
                    {formatTime(
                      secondsUntilReminder
                    )}
                  </b>
                </div>
              )}
            </div>

            {!isBreakActive && (
              <div className="vertex-focus__quick-actions">
                <button
                  type="button"
                  onClick={() =>
                    setTimerPaused(
                      (currentValue) =>
                        !currentValue
                    )
                  }
                >
                  {timerPaused ? (
                    <Play size={16} />
                  ) : (
                    <Pause size={16} />
                  )}

                  {timerPaused
                    ? "Lanjutkan timer"
                    : "Jeda timer"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSettingsOpen(
                      (currentValue) =>
                        !currentValue
                    )
                  }
                >
                  <Settings2 size={16} />
                  Atur pengingat
                </button>
              </div>
            )}

            {settingsOpen && (
              <div className="vertex-focus__section">
                <div className="vertex-focus__section-title">
                  <span>
                    <Bell size={17} />
                  </span>

                  <div>
                    <strong>
                      Interval pengingat
                    </strong>

                    <small>
                      Saat ini setiap{" "}
                      {reminderMinutes} menit
                    </small>
                  </div>
                </div>

                <div className="vertex-focus__preset-grid">
                  {REMINDER_PRESETS.map(
                    (minutes) => {
                      const isActive =
                        reminderMinutes
                        === minutes;

                      return (
                        <button
                          key={minutes}
                          type="button"
                          className={
                            isActive
                              ? "vertex-focus__preset vertex-focus__preset--active"
                              : "vertex-focus__preset"
                          }
                          onClick={() =>
                            applyReminderMinutes(
                              minutes
                            )
                          }
                        >
                          {isActive && (
                            <Check size={13} />
                          )}

                          {minutes} menit
                        </button>
                      );
                    }
                  )}
                </div>

                <form
                  className="vertex-focus__custom"
                  onSubmit={
                    submitCustomReminder
                  }
                >
                  <label htmlFor="vertex-focus-custom-minutes">
                    Durasi khusus
                  </label>

                  <div className="vertex-focus__custom-row">
                    <input
                      id="vertex-focus-custom-minutes"
                      type="number"
                      min="1"
                      max="180"
                      value={customMinutes}
                      onChange={(event) =>
                        setCustomMinutes(
                          event.target.value
                        )
                      }
                    />

                    <span>
                      menit
                    </span>

                    <button type="submit">
                      Terapkan
                    </button>
                  </div>

                  <small>
                    Gunakan angka 1 sampai 180 menit.
                  </small>
                </form>
              </div>
            )}

            {isBreakActive ? (
              <div className="vertex-focus__section">
                <div className="vertex-focus__section-title">
                  <span>
                    <Music2 size={17} />
                  </span>

                  <div>
                    <strong>
                      Musik istirahat
                    </strong>

                    <small>
                      {soundLabel}
                    </small>
                  </div>
                </div>

                <label className="vertex-focus__field">
                  <span>
                    Pilihan suara
                  </span>

                  <select
                    value={soundMode}
                    onChange={
                      handleSoundChange
                    }
                  >
                    {SOUND_OPTIONS.map(
                      (option) => (
                        <option
                          key={option.id}
                          value={option.id}
                        >
                          {option.label}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label className="vertex-focus__field">
                  <span>
                    <Volume2
                      size={13}
                      style={{
                        verticalAlign:
                          "middle",
                        marginRight: 5,
                      }}
                    />

                    Volume{" "}
                    {Math.round(
                      volume * 100
                    )}
                    %
                  </span>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(event) =>
                      setVolume(
                        Number(
                          event.target.value
                        )
                      )
                    }
                  />
                </label>

                <div className="vertex-focus__actions">
                  <button
                    type="button"
                    className="vertex-focus__button vertex-focus__button--primary"
                    onClick={
                      soundPlaying
                        ? stopSound
                        : startSound
                    }
                    disabled={
                      soundMode
                      === "hening"
                    }
                  >
                    {soundPlaying ? (
                      <Pause size={16} />
                    ) : (
                      <Play size={16} />
                    )}

                    {soundPlaying
                      ? "Jeda suara"
                      : "Putar suara"}
                  </button>

                  <button
                    type="button"
                    className="vertex-focus__button vertex-focus__button--secondary"
                    onClick={
                      finishBreak
                    }
                  >
                    Selesai
                  </button>
                </div>
              </div>
            ) : (
              <div className="vertex-focus__section">
                <div className="vertex-focus__section-title">
                  <span>
                    <Coffee size={17} />
                  </span>

                  <div>
                    <strong>
                      Perlu istirahat sekarang?
                    </strong>

                    <small>
                      Timer berhenti selama waktu istirahat.
                    </small>
                  </div>
                </div>

                <div className="vertex-focus__actions">
                  <button
                    type="button"
                    className="vertex-focus__button vertex-focus__button--secondary"
                    onClick={() =>
                      startBreak(1)
                    }
                  >
                    1 menit
                  </button>

                  <button
                    type="button"
                    className="vertex-focus__button vertex-focus__button--primary"
                    onClick={() =>
                      startBreak(5)
                    }
                  >
                    5 menit
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              className="vertex-focus__reset"
              onClick={resetTimer}
            >
              <RotateCcw size={14} />
              Reset waktu belajar
            </button>
          </section>
        )}

        {reminderOpen && (
          <div className="vertex-focus__overlay">
            <section
              className="vertex-focus__modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="vertex-focus-modal-title"
            >
              <div className="vertex-focus__modal-bell">
                <Bell size={29} />
              </div>

              <span className="vertex-focus__modal-label">
                Pengingat belajar
              </span>

              <h2 id="vertex-focus-modal-title">
                Kamu sudah belajar giat sekali!
              </h2>

              <p>
                {motivationMessage}
              </p>

              <div className="vertex-focus__modal-time">
                <Clock3 size={18} />

                <span>
                  Total belajar
                </span>

                <strong>
                  {formatTime(
                    studySeconds
                  )}
                </strong>
              </div>

              <div className="vertex-focus__modal-actions">
                <button
                  type="button"
                  className="vertex-focus__button vertex-focus__button--secondary"
                  onClick={() =>
                    startBreak(1)
                  }
                >
                  Istirahat 1 menit
                </button>

                <button
                  type="button"
                  className="vertex-focus__button vertex-focus__button--primary"
                  onClick={() =>
                    startBreak(5)
                  }
                >
                  Istirahat 5 menit
                </button>

                <button
                  type="button"
                  className="vertex-focus__modal-continue"
                  onClick={
                    continueStudy
                  }
                >
                  Lanjut belajar
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  );
}

export default StudyBreakReminder;