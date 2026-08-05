import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  checkAiHealth,
  sendAiMessage,
} from "../../services/aiApi";

import "./AiAssistant.css";


const STORAGE_KEY =
  "vertexar-ai-conversations";

const ACTIVE_CHAT_KEY =
  "vertexar-ai-active-chat";


const MOBILE_MEDIA_QUERY =
  "(max-width: 768px)";

const AI_MOBILE_STYLE_ID =
  "vertex-ai-mobile-responsive-styles";


const AI_MOBILE_STYLES = `
  /*
    Aturan berikut hanya aktif pada HP.
    Tampilan desktop dan tablet besar tidak diubah.
  */

  @media (max-width: 768px) {
    .vertex-ai-floating-button {
      right:
        max(
          12px,
          env(
            safe-area-inset-right
          )
        );

      bottom:
        max(
          12px,
          env(
            safe-area-inset-bottom
          )
        );

      max-width:
        calc(
          100vw
          - 24px
        );

      z-index: 1250;
    }

    .vertex-ai-panel {
      position: fixed;

      top:
        max(
          10px,
          env(
            safe-area-inset-top
          )
        );

      right: 10px;

      bottom:
        max(
          10px,
          env(
            safe-area-inset-bottom
          )
        );

      left: 10px;

      width: auto;
      max-width: none;

      height:
        calc(
          var(
            --vertex-ai-viewport-height,
            100dvh
          )
          - 20px
        );

      max-height:
        calc(
          var(
            --vertex-ai-viewport-height,
            100dvh
          )
          - 20px
        );

      overflow: hidden;

      border-radius: 22px;

      z-index: 1200;
    }

    .vertex-ai-panel.is-open {
      display: flex;
      flex-direction: column;
    }

    .vertex-ai-header {
      flex-shrink: 0;

      min-width: 0;
      padding:
        12px
        13px;
    }

    .vertex-ai-header-identity {
      min-width: 0;
      flex: 1;
    }

    .vertex-ai-header-text {
      min-width: 0;
    }

    .vertex-ai-header-text h2,
    .vertex-ai-header-text p {
      overflow: hidden;

      text-overflow:
        ellipsis;

      white-space: nowrap;
    }

    .vertex-ai-panel-body {
      position: relative;

      min-width: 0;
      min-height: 0;

      flex: 1;

      overflow: hidden;
    }

    .vertex-ai-chat-area {
      width: 100%;
      min-width: 0;
      min-height: 0;
      height: 100%;

      display: flex;
      flex-direction: column;

      overflow: hidden;
    }

    .vertex-ai-chat-topbar {
      flex-shrink: 0;

      padding:
        9px
        12px;
    }

    .vertex-ai-messages {
      min-width: 0;
      min-height: 0;

      flex: 1;

      padding:
        14px
        12px;

      overflow-x: hidden;
      overflow-y: auto;

      overscroll-behavior:
        contain;

      -webkit-overflow-scrolling:
        touch;
    }

    .vertex-ai-message-row {
      min-width: 0;
      max-width: 100%;
    }

    .vertex-ai-message-content {
      min-width: 0;
      max-width:
        calc(
          100%
          - 40px
        );

      overflow-wrap:
        anywhere;

      word-break:
        normal;
    }

    .vertex-ai-message-row.is-user
    .vertex-ai-message-content {
      max-width: 86%;
    }

    .vertex-ai-markdown {
      min-width: 0;
      max-width: 100%;
    }

    .vertex-ai-markdown img,
    .vertex-ai-markdown table,
    .vertex-ai-markdown pre,
    .vertex-ai-markdown code {
      max-width: 100%;
    }

    .vertex-ai-markdown table,
    .vertex-ai-markdown pre {
      overflow-x: auto;

      -webkit-overflow-scrolling:
        touch;
    }

    .vertex-ai-quick-questions {
      flex-shrink: 0;

      max-height: 190px;

      padding:
        10px
        12px;

      overflow-y: auto;

      overscroll-behavior:
        contain;
    }

    .vertex-ai-quick-questions > div {
      display: grid;
      grid-template-columns: 1fr;
      gap: 7px;
    }

    .vertex-ai-quick-questions button {
      width: 100%;

      text-align: left;
    }

    .vertex-ai-error {
      flex-shrink: 0;

      margin:
        8px
        12px
        0;
    }

    .vertex-ai-input-area {
      position: relative;

      flex-shrink: 0;

      padding:
        10px
        12px
        max(
          10px,
          env(
            safe-area-inset-bottom
          )
        );

      background: #ffffff;
    }

    .vertex-ai-input-wrapper {
      min-width: 0;
      width: 100%;
    }

    .vertex-ai-input-wrapper textarea {
      min-width: 0;
      max-width: 100%;

      font-size: 16px;

      resize: none;
    }

    .vertex-ai-input-wrapper button {
      flex-shrink: 0;
    }

    .vertex-ai-input-area > p {
      margin:
        7px
        0
        0;

      font-size: 10px;
      line-height: 1.35;
    }

    .vertex-ai-history-panel {
      position: absolute;

      z-index: 15;

      inset: 0;

      width: 100%;
      max-width: none;
      height: 100%;

      overflow: hidden;

      transform:
        translateX(
          -105%
        );

      transition:
        transform
        220ms
        cubic-bezier(
          0.22,
          1,
          0.36,
          1
        );
    }

    .vertex-ai-history-panel.is-open {
      transform:
        translateX(0);
    }

    .vertex-ai-history-header {
      flex-shrink: 0;

      padding:
        13px
        14px;
    }

    .vertex-ai-history-search {
      flex-shrink: 0;

      margin:
        0
        12px;
    }

    .vertex-ai-history-search input {
      min-width: 0;

      font-size: 16px;
    }

    .vertex-ai-new-chat-button {
      flex-shrink: 0;

      margin:
        10px
        12px
        0;
    }

    .vertex-ai-history-list {
      min-height: 0;

      overflow-y: auto;

      overscroll-behavior:
        contain;

      -webkit-overflow-scrolling:
        touch;
    }

    .vertex-ai-history-item,
    .vertex-ai-history-select {
      min-width: 0;
    }

    .vertex-ai-history-select strong {
      overflow: hidden;

      text-overflow:
        ellipsis;

      white-space: nowrap;
    }

    .vertex-ai-backdrop {
      z-index: 1150;

      backdrop-filter:
        blur(2px);

      -webkit-backdrop-filter:
        blur(2px);
    }
  }

  @media (max-width: 420px) {
    .vertex-ai-panel {
      top:
        max(
          7px,
          env(
            safe-area-inset-top
          )
        );

      right: 7px;

      bottom:
        max(
          7px,
          env(
            safe-area-inset-bottom
          )
        );

      left: 7px;

      height:
        calc(
          var(
            --vertex-ai-viewport-height,
            100dvh
          )
          - 14px
        );

      max-height:
        calc(
          var(
            --vertex-ai-viewport-height,
            100dvh
          )
          - 14px
        );

      border-radius: 19px;
    }

    .vertex-ai-header {
      padding:
        10px
        11px;
    }

    .vertex-ai-header-logo {
      width: 34px;
      height: 34px;
    }

    .vertex-ai-header-text h2 {
      font-size: 15px;
    }

    .vertex-ai-header-text p {
      font-size: 10px;
    }

    .vertex-ai-header-icon-button {
      width: 38px;
      min-width: 38px;
      height: 38px;
    }

    .vertex-ai-chat-topbar {
      padding:
        8px
        10px;
    }

    .vertex-ai-messages {
      padding:
        12px
        10px;
    }

    .vertex-ai-message-content {
      font-size: 13px;
      line-height: 1.55;
    }

    .vertex-ai-message-avatar {
      width: 30px;
      min-width: 30px;
      height: 30px;
    }

    .vertex-ai-quick-questions {
      max-height: 165px;

      padding:
        8px
        10px;
    }

    .vertex-ai-quick-questions button {
      padding:
        8px
        10px;

      font-size: 11px;
    }

    .vertex-ai-input-area {
      padding:
        8px
        10px
        max(
          8px,
          env(
            safe-area-inset-bottom
          )
        );
    }

    .vertex-ai-floating-label {
      font-size: 12px;
    }
  }
`;


function installAiMobileStyles() {
  if (
    typeof document === "undefined"
  ) {
    return;
  }

  const existingStyle =
    document.getElementById(
      AI_MOBILE_STYLE_ID
    );

  if (existingStyle) {
    return;
  }

  const styleElement =
    document.createElement(
      "style"
    );

  styleElement.id =
    AI_MOBILE_STYLE_ID;

  styleElement.textContent =
    AI_MOBILE_STYLES;

  document.head.appendChild(
    styleElement
  );
}


/*
  Style tambahan hanya dipasang satu kali.
  Seluruh aturan di dalamnya dibatasi oleh
  media query HP sehingga desktop tetap sama.
*/
installAiMobileStyles();


const quickQuestions = [
  "Apa perbedaan kubus dan balok?",
  "Jelaskan rumus volume tabung",
  "Buatkan contoh soal volume kubus",
  "Apa saja unsur-unsur prisma?",
];


function createId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}


function createWelcomeMessage() {
  return {
    id: createId(),
    role: "assistant",
    content:
      "Halo! Saya **AI VertexAR**.\n\nSaya siap membantu kamu mempelajari kubus, balok, prisma, limas, tabung, kerucut, bola, volume, dan luas permukaan.\n\nMateri apa yang ingin kamu pelajari?",
    createdAt: new Date().toISOString(),
    isWelcome: true,
  };
}


function createConversation() {
  const id = createId();
  const now = new Date().toISOString();

  return {
    id,
    title: "Percakapan Baru",
    createdAt: now,
    updatedAt: now,
    messages: [
      createWelcomeMessage(),
    ],
  };
}


function getStoredConversations() {
  try {
    const storedValue =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    if (!storedValue) {
      return [];
    }

    const parsedValue =
      JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(
      (conversation) =>
        conversation &&
        conversation.id &&
        Array.isArray(
          conversation.messages
        )
    );
  } catch {
    return [];
  }
}


function makeConversationTitle(message) {
  const cleanMessage = String(message)
    .replace(/\s+/g, " ")
    .trim();

  if (cleanMessage.length <= 36) {
    return cleanMessage;
  }

  return `${cleanMessage.slice(0, 36)}...`;
}


function formatConversationDate(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "id-ID",
    {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}


function AiLogoIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <path
        d="M32 7L37 23L53 28L37 33L32 49L27 33L11 28L27 23L32 7Z"
        fill="currentColor"
      />

      <path
        d="M49 39L52 48L61 51L52 54L49 63L46 54L37 51L46 48L49 39Z"
        fill="currentColor"
        opacity="0.75"
      />

      <circle
        cx="13"
        cy="47"
        r="4"
        fill="currentColor"
        opacity="0.55"
      />
    </svg>
  );
}


function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M4 6H20M4 12H20M4 18H20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}


function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
    </svg>
  );
}


function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M4 4L21 12L4 20L7 13L15 12L7 11L4 4Z"
        fill="currentColor"
      />
    </svg>
  );
}


function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M12 5V19M5 12H19"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}


function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M8 9V18M12 9V18M16 9V18M5 6H19M9 6V4H15V6M7 6L8 21H16L17 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M16 16L21 21"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}


function AiAssistantContent() {
  const [isOpen, setIsOpen] =
    useState(false);

  const [
    isHistoryOpen,
    setIsHistoryOpen,
  ] = useState(false);


  const [
    isMobileViewport,
    setIsMobileViewport,
  ] = useState(() => {
    if (
      typeof window
      === "undefined"
    ) {
      return false;
    }

    return window
      .matchMedia(
        MOBILE_MEDIA_QUERY
      )
      .matches;
  });

  const [
    conversations,
    setConversations,
  ] = useState(() => {
    const storedConversations =
      getStoredConversations();

    if (storedConversations.length > 0) {
      return storedConversations;
    }

    return [
      createConversation(),
    ];
  });

  const [
    activeConversationId,
    setActiveConversationId,
  ] = useState(() => {
    return (
      window.localStorage.getItem(
        ACTIVE_CHAT_KEY
      ) || ""
    );
  });

  const [
    inputValue,
    setInputValue,
  ] = useState("");

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    searchValue,
    setSearchValue,
  ] = useState("");

  const [
    isAiOnline,
    setIsAiOnline,
  ] = useState(true);

  const messagesEndRef =
    useRef(null);

  const textareaRef =
    useRef(null);


  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        MOBILE_MEDIA_QUERY
      );


    function handleViewportChange(
      event
    ) {
      setIsMobileViewport(
        event.matches
      );

      /*
        Riwayat ditutup ketika ukuran layar berubah
        supaya panel tidak tersangkut.
      */
      setIsHistoryOpen(false);
    }


    setIsMobileViewport(
      mediaQuery.matches
    );


    if (
      typeof mediaQuery.addEventListener
      === "function"
    ) {
      mediaQuery.addEventListener(
        "change",
        handleViewportChange
      );

      return () => {
        mediaQuery.removeEventListener(
          "change",
          handleViewportChange
        );
      };
    }


    mediaQuery.addListener(
      handleViewportChange
    );

    return () => {
      mediaQuery.removeListener(
        handleViewportChange
      );
    };
  }, []);


  useEffect(() => {
    /*
      Mengunci scroll halaman belakang hanya ketika
      chatbot dibuka di HP. Desktop tidak diubah.
    */

    if (
      !isOpen
      || !isMobileViewport
    ) {
      return undefined;
    }


    const previousOverflow =
      document.body.style.overflow;

    const previousOverscrollBehavior =
      document.body.style
        .overscrollBehavior;


    document.body.style.overflow =
      "hidden";

    document.body.style
      .overscrollBehavior =
      "none";


    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.body.style
        .overscrollBehavior =
        previousOverscrollBehavior;
    };
  }, [
    isOpen,
    isMobileViewport,
  ]);


  useEffect(() => {
    /*
      visualViewport membuat tinggi panel mengikuti
      area yang tersisa ketika keyboard HP terbuka.
    */

    if (
      !isOpen
      || !isMobileViewport
    ) {
      return undefined;
    }


    const visualViewport =
      window.visualViewport;


    function updateViewportHeight() {
      const viewportHeight =
        visualViewport?.height
        || window.innerHeight;


      document.documentElement
        .style
        .setProperty(
          "--vertex-ai-viewport-height",
          `${Math.round(
            viewportHeight
          )}px`
        );
    }


    updateViewportHeight();


    visualViewport?.addEventListener(
      "resize",
      updateViewportHeight
    );

    visualViewport?.addEventListener(
      "scroll",
      updateViewportHeight
    );

    window.addEventListener(
      "orientationchange",
      updateViewportHeight
    );


    return () => {
      visualViewport?.removeEventListener(
        "resize",
        updateViewportHeight
      );

      visualViewport?.removeEventListener(
        "scroll",
        updateViewportHeight
      );

      window.removeEventListener(
        "orientationchange",
        updateViewportHeight
      );

      document.documentElement
        .style
        .removeProperty(
          "--vertex-ai-viewport-height"
        );
    };
  }, [
    isOpen,
    isMobileViewport,
  ]);


  useEffect(() => {
    function closeWithEscape(
      event
    ) {
      if (
        event.key !== "Escape"
      ) {
        return;
      }


      setIsHistoryOpen(false);
      setIsOpen(false);
    }


    document.addEventListener(
      "keydown",
      closeWithEscape
    );


    return () => {
      document.removeEventListener(
        "keydown",
        closeWithEscape
      );
    };
  }, []);


  useEffect(() => {
    if (conversations.length === 0) {
      const conversation =
        createConversation();

      setConversations([
        conversation,
      ]);

      setActiveConversationId(
        conversation.id
      );

      return;
    }

    const activeConversationExists =
      conversations.some(
        (conversation) =>
          conversation.id ===
          activeConversationId
      );

    if (!activeConversationExists) {
      setActiveConversationId(
        conversations[0].id
      );
    }
  }, [
    conversations,
    activeConversationId,
  ]);


  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(conversations)
    );
  }, [conversations]);


  useEffect(() => {
    if (!activeConversationId) {
      return;
    }

    window.localStorage.setItem(
      ACTIVE_CHAT_KEY,
      activeConversationId
    );
  }, [activeConversationId]);


  useEffect(() => {
    async function checkStatus() {
      try {
        await checkAiHealth();
        setIsAiOnline(true);
      } catch {
        setIsAiOnline(false);
      }
    }

    checkStatus();
  }, []);


  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const timeoutId =
      window.setTimeout(() => {
        messagesEndRef.current
          ?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
      }, 80);

    return () => {
      window.clearTimeout(
        timeoutId
      );
    };
  }, [
    isOpen,
    isLoading,
    conversations,
    activeConversationId,
  ]);


  useEffect(() => {
    if (
      !isOpen
      || isMobileViewport
    ) {
      return undefined;
    }

    /*
      Desktop tetap fokus otomatis seperti sebelumnya.
      Di HP fokus otomatis dimatikan agar keyboard
      tidak langsung menutupi percakapan.
    */

    const timeoutId =
      window.setTimeout(() => {
        textareaRef.current?.focus();
      }, 250);

    return () => {
      window.clearTimeout(
        timeoutId
      );
    };
  }, [
    isOpen,
    isMobileViewport,
  ]);


  const activeConversation =
    useMemo(() => {
      return (
        conversations.find(
          (conversation) =>
            conversation.id ===
            activeConversationId
        ) || conversations[0]
      );
    }, [
      conversations,
      activeConversationId,
    ]);


  const filteredConversations =
    useMemo(() => {
      const keyword =
        searchValue
          .trim()
          .toLowerCase();

      const sortedConversations = [
        ...conversations,
      ].sort(
        (
          firstConversation,
          secondConversation
        ) =>
          new Date(
            secondConversation.updatedAt
          ).getTime() -
          new Date(
            firstConversation.updatedAt
          ).getTime()
      );

      if (!keyword) {
        return sortedConversations;
      }

      return sortedConversations.filter(
        (conversation) => {
          const title =
            String(
              conversation.title || ""
            ).toLowerCase();

          const titleMatches =
            title.includes(keyword);

          const messageMatches =
            (
              conversation.messages || []
            ).some((message) =>
              String(
                message.content || ""
              )
                .toLowerCase()
                .includes(keyword)
            );

          return (
            titleMatches ||
            messageMatches
          );
        }
      );
    }, [
      conversations,
      searchValue,
    ]);


  function resizeTextarea(element) {
    if (!element) {
      return;
    }

    element.style.height = "24px";

    const nextHeight =
      Math.min(
        element.scrollHeight,
        112
      );

    element.style.height =
      `${nextHeight}px`;
  }


  function resetTextareaHeight() {
    if (!textareaRef.current) {
      return;
    }

    textareaRef.current.style.height =
      "24px";
  }


  function updateConversation(
    conversationId,
    updater
  ) {
    setConversations(
      (currentConversations) =>
        currentConversations.map(
          (conversation) => {
            if (
              conversation.id !==
              conversationId
            ) {
              return conversation;
            }

            return updater(
              conversation
            );
          }
        )
    );
  }


  function handleOpenChange() {
    if (isOpen) {
      setIsHistoryOpen(false);
    }

    setIsOpen(
      (currentValue) =>
        !currentValue
    );
  }


  function handleNewConversation() {
    const conversation =
      createConversation();

    setConversations(
      (currentConversations) => [
        conversation,
        ...currentConversations,
      ]
    );

    setActiveConversationId(
      conversation.id
    );

    setInputValue("");
    setSearchValue("");
    setErrorMessage("");
    setIsHistoryOpen(false);

    window.setTimeout(() => {
      resetTextareaHeight();
      textareaRef.current?.focus();
    }, 50);
  }


  function handleSelectConversation(
    conversationId
  ) {
    setActiveConversationId(
      conversationId
    );

    setErrorMessage("");
    setIsHistoryOpen(false);
  }


  function handleDeleteConversation(
    conversationId
  ) {
    const remainingConversations =
      conversations.filter(
        (conversation) =>
          conversation.id !==
          conversationId
      );

    if (
      remainingConversations.length === 0
    ) {
      const newConversation =
        createConversation();

      setConversations([
        newConversation,
      ]);

      setActiveConversationId(
        newConversation.id
      );

      return;
    }

    setConversations(
      remainingConversations
    );

    if (
      activeConversationId ===
      conversationId
    ) {
      setActiveConversationId(
        remainingConversations[0].id
      );
    }
  }


  async function submitMessage(
    customMessage
  ) {
    const message = String(
      customMessage ?? inputValue
    ).trim();

    if (
      !message ||
      isLoading ||
      !activeConversation
    ) {
      return;
    }

    const conversationId =
      activeConversation.id;

    const previousMessages =
      activeConversation.messages || [];

    const userMessage = {
      id: createId(),
      role: "user",
      content: message,
      createdAt:
        new Date().toISOString(),
    };

    const isFirstUserMessage =
      previousMessages.filter(
        (chatMessage) =>
          chatMessage.role === "user"
      ).length === 0;

    updateConversation(
      conversationId,
      (conversation) => ({
        ...conversation,

        title: isFirstUserMessage
          ? makeConversationTitle(
              message
            )
          : conversation.title,

        updatedAt:
          new Date().toISOString(),

        messages: [
          ...(conversation.messages || []),
          userMessage,
        ],
      })
    );

    setInputValue("");
    setErrorMessage("");
    setIsLoading(true);

    resetTextareaHeight();

    try {
      const history =
        previousMessages
          .filter(
            (chatMessage) =>
              !chatMessage.isWelcome
          )
          .slice(-16)
          .map((chatMessage) => ({
            role:
              chatMessage.role,

            content:
              chatMessage.content,
          }));

      const response =
        await sendAiMessage({
          message,
          history,
        });

      const assistantMessage = {
        id: createId(),
        role: "assistant",
        content: response.answer,
        createdAt:
          new Date().toISOString(),
      };

      updateConversation(
        conversationId,
        (conversation) => ({
          ...conversation,

          updatedAt:
            new Date().toISOString(),

          messages: [
            ...(conversation.messages || []),
            assistantMessage,
          ],
        })
      );

      setIsAiOnline(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "AI VertexAR belum dapat memberikan jawaban."
      );

      setIsAiOnline(false);
    } finally {
      setIsLoading(false);
    }
  }


  function handleSubmit(event) {
    event.preventDefault();

    submitMessage();
  }


  function handleTextareaChange(
    event
  ) {
    setInputValue(
      event.target.value
    );

    resizeTextarea(
      event.target
    );
  }


  function handleTextareaKeyDown(
    event
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      submitMessage();
    }
  }


  return (
    <>
      <button
        type="button"
        className={`vertex-ai-floating-button ${
          isOpen ? "is-open" : ""
        }`}
        onClick={handleOpenChange}
        aria-label={
          isOpen
            ? "Tutup AI VertexAR"
            : "Buka AI VertexAR"
        }
      >
        {isOpen ? (
          <CloseIcon />
        ) : (
          <>
            <AiLogoIcon />

            <span className="vertex-ai-floating-label">
              Tanya AI
            </span>
          </>
        )}
      </button>


      <aside
        className={`vertex-ai-panel ${
          isOpen ? "is-open" : ""
        }`}
        aria-hidden={!isOpen}
        role="dialog"
        aria-modal={
          isMobileViewport
            ? "true"
            : undefined
        }
        aria-label="AI VertexAR"
      >
        <header className="vertex-ai-header">
          <button
            type="button"
            className="vertex-ai-header-icon-button"
            onClick={() =>
              setIsHistoryOpen(
                (currentValue) =>
                  !currentValue
              )
            }
            aria-label="Buka riwayat percakapan"
          >
            <MenuIcon />
          </button>


          <div className="vertex-ai-header-identity">
            <div className="vertex-ai-header-logo">
              <AiLogoIcon />
            </div>

            <div className="vertex-ai-header-text">
              <h2>
                AI VertexAR
              </h2>

              <p>
                <span
                  className={`vertex-ai-status-dot ${
                    isAiOnline
                      ? "is-online"
                      : "is-offline"
                  }`}
                />

                {isAiOnline
                  ? "Siap membantu belajar"
                  : "Koneksi AI bermasalah"}
              </p>
            </div>
          </div>


          <button
            type="button"
            className="vertex-ai-header-icon-button"
            onClick={() => {
              setIsOpen(false);
              setIsHistoryOpen(false);
            }}
            aria-label="Tutup chatbot"
          >
            <CloseIcon />
          </button>
        </header>


        <div className="vertex-ai-panel-body">
          <section
            className={`vertex-ai-history-panel ${
              isHistoryOpen
                ? "is-open"
                : ""
            }`}
            aria-hidden={!isHistoryOpen}
          >
            <div className="vertex-ai-history-header">
              <div>
                <h3>
                  Riwayat Chat
                </h3>

                <p>
                  Percakapan tersimpan
                  di perangkat ini.
                </p>
              </div>

              <button
                type="button"
                className="vertex-ai-new-chat-icon"
                onClick={
                  handleNewConversation
                }
                aria-label="Buat chat baru"
              >
                <PlusIcon />
              </button>
            </div>


            <label className="vertex-ai-history-search">
              <SearchIcon />

              <input
                type="search"
                placeholder="Cari percakapan..."
                value={searchValue}
                onChange={(event) =>
                  setSearchValue(
                    event.target.value
                  )
                }
              />
            </label>


            <button
              type="button"
              className="vertex-ai-new-chat-button"
              onClick={
                handleNewConversation
              }
            >
              <PlusIcon />
              Chat Baru
            </button>


            <div className="vertex-ai-history-list">
              {filteredConversations.length >
              0 ? (
                filteredConversations.map(
                  (conversation) => (
                    <div
                      key={
                        conversation.id
                      }
                      className={`vertex-ai-history-item ${
                        conversation.id ===
                        activeConversationId
                          ? "is-active"
                          : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="vertex-ai-history-select"
                        onClick={() =>
                          handleSelectConversation(
                            conversation.id
                          )
                        }
                      >
                        <strong>
                          {
                            conversation.title
                          }
                        </strong>

                        <small>
                          {formatConversationDate(
                            conversation.updatedAt
                          )}
                        </small>
                      </button>

                      <button
                        type="button"
                        className="vertex-ai-delete-chat"
                        onClick={() =>
                          handleDeleteConversation(
                            conversation.id
                          )
                        }
                        aria-label={`Hapus percakapan ${conversation.title}`}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  )
                )
              ) : (
                <div className="vertex-ai-history-empty">
                  Percakapan tidak ditemukan.
                </div>
              )}
            </div>
          </section>


          <section className="vertex-ai-chat-area">
            <div className="vertex-ai-chat-topbar">
              <button
                type="button"
                onClick={
                  handleNewConversation
                }
              >
                <PlusIcon />
                Chat Baru
              </button>
            </div>


            <div
              className="vertex-ai-messages"
              aria-live="polite"
            >
              {activeConversation?.messages?.map(
                (message) => (
                  <div
                    key={message.id}
                    className={`vertex-ai-message-row ${
                      message.role ===
                      "user"
                        ? "is-user"
                        : "is-assistant"
                    }`}
                  >
                    {message.role ===
                      "assistant" && (
                      <div className="vertex-ai-message-avatar">
                        <AiLogoIcon />
                      </div>
                    )}

                    <div className="vertex-ai-message-content">
                      {message.role ===
                      "assistant" ? (
                        <div className="vertex-ai-markdown">
                          <ReactMarkdown
                            remarkPlugins={[
                              remarkGfm,
                            ]}
                          >
                            {
                              message.content
                            }
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p>
                          {message.content}
                        </p>
                      )}
                    </div>
                  </div>
                )
              )}


              {isLoading && (
                <div className="vertex-ai-message-row is-assistant">
                  <div className="vertex-ai-message-avatar">
                    <AiLogoIcon />
                  </div>

                  <div className="vertex-ai-message-content vertex-ai-typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}


              <div
                ref={messagesEndRef}
              />
            </div>


            {activeConversation?.messages
              ?.filter(
                (message) =>
                  message.role === "user"
              ).length === 0 && (
              <div className="vertex-ai-quick-questions">
                <p>
                  Pertanyaan yang dapat
                  kamu coba:
                </p>

                <div>
                  {quickQuestions.map(
                    (question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() =>
                          submitMessage(
                            question
                          )
                        }
                        disabled={
                          isLoading
                        }
                      >
                        {question}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}


            {errorMessage && (
              <div
                className="vertex-ai-error"
                role="alert"
              >
                <strong>
                  Pesan belum terkirim
                </strong>

                <span>
                  {errorMessage}
                </span>
              </div>
            )}


            <form
              className="vertex-ai-input-area"
              onSubmit={handleSubmit}
            >
              <div className="vertex-ai-input-wrapper">
                <textarea
                  ref={textareaRef}
                  rows="1"
                  value={inputValue}
                  onChange={
                    handleTextareaChange
                  }
                  onKeyDown={
                    handleTextareaKeyDown
                  }
                  placeholder="Tanyakan materi bangun ruang..."
                  maxLength={3000}
                  disabled={isLoading}
                  aria-label="Pertanyaan untuk AI VertexAR"
                />

                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !inputValue.trim()
                  }
                  aria-label="Kirim pertanyaan"
                >
                  <SendIcon />
                </button>
              </div>

              <p>
                AI VertexAR dapat membuat
                kesalahan. Periksa kembali
                hasil perhitungan penting.
              </p>
            </form>
          </section>
        </div>
      </aside>


      {isOpen && (
        <button
          type="button"
          className="vertex-ai-backdrop"
          onClick={() => {
            setIsOpen(false);
            setIsHistoryOpen(false);
          }}
          aria-label="Tutup AI VertexAR"
        />
      )}
    </>
  );
}


function AiAssistant() {
  const location =
    useLocation();

  const pathname =
    location.pathname;

  const isLatihanPage =
    pathname === "/latihan" ||
    pathname.startsWith(
      "/latihan/"
    );

  if (isLatihanPage) {
    return null;
  }

  return (
    <AiAssistantContent />
  );
}


export default AiAssistant;