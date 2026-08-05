import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

import {
  NavLink,
  useLocation,
} from "react-router-dom";

import StudyBreakReminder from "../study/StudyBreakReminder";

import logo from "../../assets/images/logo.png";


const DROPDOWN_ITEMS = [
  {
    label: "Klasifikasi Bangun Ruang",
    path: "/bangun-ruang",
  },
  {
    label: "Bangun Ruang Sisi Datar",
    path: "/bangun-ruang/sisi-datar",
  },
  {
    label: "Bangun Ruang Sisi Lengkung",
    path: "/bangun-ruang/sisi-lengkung",
  },
];


const MOBILE_MEDIA_QUERY =
  "(max-width: 768px)";

const NAVBAR_STYLE_ID =
  "vertex-navbar-floating-styles";


const NAVBAR_FLOATING_STYLES = `
  .vertex-navbar.vertex-navbar--floating {
    position: sticky;
    top: 12px;

    /*
      Navbar tetap di atas konten halaman,
      tetapi berada di bawah chatbot.
    */
    z-index: 900;

    width: calc(100% - 80px);
    max-width: 1720px;

    margin:
      12px auto
      0 auto;

    overflow: visible;

    background:
      rgba(
        255,
        255,
        255,
        0.76
      );

    border:
      1px solid
      rgba(
        185,
        208,
        237,
        0.5
      );

    backdrop-filter:
      blur(18px)
      saturate(145%);

    -webkit-backdrop-filter:
      blur(18px)
      saturate(145%);

    box-shadow:
      0 10px 28px
      rgba(
        9,
        57,
        125,
        0.1
      );

    transition:
      background 240ms ease,
      box-shadow 240ms ease,
      border-color 240ms ease,
      transform 240ms ease;
  }

  .vertex-navbar.vertex-navbar--floating.vertex-navbar--scrolled {
    background:
      rgba(
        255,
        255,
        255,
        0.88
      );

    border-color:
      rgba(
        126,
        173,
        229,
        0.58
      );

    box-shadow:
      0 16px 42px
      rgba(
        7,
        53,
        118,
        0.18
      );
  }

  .vertex-navbar.vertex-navbar--floating
  .vertex-logo {
    transition:
      transform 220ms ease;
  }

  .vertex-navbar.vertex-navbar--floating.vertex-navbar--scrolled
  .vertex-logo {
    transform:
      scale(0.96);
  }

  /*
    Dropdown tetap muncul di atas navbar
    dan konten halaman.
  */
  .vertex-navbar--floating
  .vertex-nav-dropdown-menu {
    z-index: 950;
  }

  .vertex-navbar--floating
  .vertex-menu-mobile {
    z-index: 960;
  }

  /*
    Komponen focus tetap bisa diklik.
    Seluruh navbar berada di bawah chatbot
    karena stacking context navbar = 900.
  */
  .vertex-navbar--floating
  .vertex-focus,
  .vertex-navbar--floating
  .study-reminder,
  .vertex-navbar--floating
  .study-break-reminder {
    pointer-events: auto;
  }

  .vertex-navbar-reminder {
    display: flex;
    flex-shrink: 0;
    align-items: center;

    min-width: 0;
    margin-left: 16px;
  }

  .vertex-mobile-reminder-area {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    min-width: 0;
    margin-top: 2px;
    padding: 10px;

    background:
      rgba(
        223,
        245,
        255,
        0.72
      );

    border:
      1px solid
      rgba(
        126,
        173,
        229,
        0.28
      );

    border-radius: 16px;
  }

  .vertex-mobile-reminder-area > * {
    max-width: 100%;
  }

  @media (max-width: 1250px) {
    .vertex-navbar.vertex-navbar--floating {
      top: 8px;

      width:
        calc(100% - 32px);

      margin-top:
        8px;
    }

    .vertex-navbar-reminder {
      margin-left: 8px;
    }
  }

  /*
    Tampilan HP umum.
    Perubahan ini hanya aktif pada layar maksimal 768px.
  */
  @media (max-width: 768px) {
    .vertex-navbar.vertex-navbar--floating {
      top: 6px;

      width:
        calc(100% - 20px);

      min-height: 64px;

      margin-top:
        6px;

      padding:
        6px
        12px;

      gap: 8px;

      background:
        rgba(
          255,
          255,
          255,
          0.92
        );

      border-radius: 20px;

      backdrop-filter:
        blur(16px)
        saturate(140%);

      -webkit-backdrop-filter:
        blur(16px)
        saturate(140%);

      box-shadow:
        0 9px 24px
        rgba(
          7,
          53,
          118,
          0.14
        );
    }

    .vertex-navbar.vertex-navbar--floating
    .vertex-logo-link {
      min-width: 0;
      flex-shrink: 1;
    }

    .vertex-navbar.vertex-navbar--floating
    .vertex-logo {
      width: 72px;
      height: 50px;

      flex-shrink: 0;
    }

    .vertex-navbar.vertex-navbar--floating.vertex-navbar--scrolled
    .vertex-logo {
      transform:
        scale(0.98);
    }

    .vertex-navbar.vertex-navbar--floating
    .vertex-mobile-button {
      width: 44px;
      min-width: 44px;
      height: 44px;
      min-height: 44px;

      padding: 0;

      display: inline-flex;
      align-items: center;
      justify-content: center;

      color: #073b91;
      background:
        rgba(
          223,
          245,
          255,
          0.86
        );

      border:
        1px solid
        rgba(
          126,
          173,
          229,
          0.35
        );

      border-radius: 14px;

      -webkit-tap-highlight-color:
        transparent;

      transition:
        color 180ms ease,
        background-color 180ms ease,
        transform 180ms ease;
    }

    .vertex-navbar.vertex-navbar--floating
    .vertex-mobile-button:active {
      color: #ffffff;
      background: #073b91;

      transform:
        scale(0.94);
    }

    .vertex-navbar.vertex-navbar--floating
    .vertex-mobile-button:focus-visible {
      outline:
        3px solid
        rgba(
          7,
          59,
          145,
          0.22
        );

      outline-offset: 3px;
    }

    .vertex-navbar.vertex-navbar--floating
    .vertex-menu-mobile {
      position: absolute;

      top:
        calc(
          100%
          + 8px
        );

      right: 0;
      left: 0;

      width: 100%;
      max-height:
        calc(
          100dvh
          - 92px
        );

      padding: 13px;

      display: flex;
      flex-direction: column;
      gap: 7px;

      overflow-x: hidden;
      overflow-y: auto;

      overscroll-behavior:
        contain;

      background:
        rgba(
          255,
          255,
          255,
          0.97
        );

      border:
        1px solid
        rgba(
          185,
          208,
          237,
          0.72
        );

      border-radius: 18px;

      box-shadow:
        0 16px 36px
        rgba(
          7,
          53,
          118,
          0.2
        );

      backdrop-filter:
        blur(18px);

      -webkit-backdrop-filter:
        blur(18px);
    }

    .vertex-navbar.vertex-navbar--floating
    .vertex-mobile-item {
      width: 100%;
      min-height: 43px;

      padding:
        10px
        14px;

      display: flex;
      align-items: center;
      justify-content: center;

      color: #073b91;
      background: #f2f7ff;

      border: 0;
      border-radius: 999px;

      font-size: 13px;
      font-weight: 600;
      line-height: 1.25;

      text-align: center;
      text-decoration: none;

      cursor: pointer;

      -webkit-tap-highlight-color:
        transparent;
    }

    .vertex-navbar.vertex-navbar--floating
    .vertex-mobile-item:active {
      transform:
        scale(0.98);
    }

    .vertex-navbar.vertex-navbar--floating
    .vertex-mobile-active {
      color: #ffffff;
      background: #073b91;
    }

    .vertex-navbar.vertex-navbar--floating
    .vertex-mobile-dropdown-trigger {
      gap: 6px;
    }

    .vertex-navbar.vertex-navbar--floating
    .vertex-mobile-submenu {
      width: 100%;

      padding:
        1px
        8px
        5px;

      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .vertex-navbar.vertex-navbar--floating
    .vertex-mobile-submenu-link {
      width: 100%;
      min-height: 39px;

      padding:
        9px
        12px;

      display: flex;
      align-items: center;
      justify-content: center;

      color: #073b91;
      background: #d9e9fb;

      border-radius: 999px;

      font-size: 12px;
      font-weight: 600;
      line-height: 1.25;

      text-align: center;
      text-decoration: none;

      overflow-wrap: anywhere;
    }

    .vertex-navbar.vertex-navbar--floating
    .vertex-mobile-submenu-link:active {
      color: #ffffff;
      background: #073b91;
    }
  }

  /*
    Penyempurnaan HP kecil sekitar 320px–420px.
  */
  @media (max-width: 420px) {
    .vertex-navbar.vertex-navbar--floating {
      width:
        calc(100% - 16px);

      padding:
        5px
        10px;

      border-radius: 18px;
    }

    .vertex-navbar.vertex-navbar--floating
    .vertex-logo {
      width: 66px;
      height: 46px;
    }

    .vertex-navbar.vertex-navbar--floating
    .vertex-mobile-button {
      width: 42px;
      min-width: 42px;
      height: 42px;
      min-height: 42px;

      border-radius: 13px;
    }

    .vertex-navbar.vertex-navbar--floating
    .vertex-menu-mobile {
      padding: 11px;
      gap: 6px;

      border-radius: 16px;
    }

    .vertex-navbar.vertex-navbar--floating
    .vertex-mobile-item {
      min-height: 41px;

      padding:
        9px
        12px;

      font-size: 12.5px;
    }

    .vertex-navbar.vertex-navbar--floating
    .vertex-mobile-submenu {
      padding-right: 5px;
      padding-left: 5px;
    }

    .vertex-navbar.vertex-navbar--floating
    .vertex-mobile-submenu-link {
      min-height: 37px;
      font-size: 11.5px;
    }

    .vertex-mobile-reminder-area {
      padding: 8px;
      border-radius: 14px;
    }
  }

  @media (
    prefers-reduced-motion:
    reduce
  ) {
    .vertex-navbar.vertex-navbar--floating,
    .vertex-navbar.vertex-navbar--floating
    .vertex-logo,
    .vertex-navbar.vertex-navbar--floating
    .vertex-mobile-button {
      transition: none;
    }
  }
`;


function installNavbarStyles() {
  if (
    typeof document === "undefined"
  ) {
    return;
  }

  const existingStyle =
    document.getElementById(
      NAVBAR_STYLE_ID
    );

  if (existingStyle) {
    return;
  }

  const styleElement =
    document.createElement(
      "style"
    );

  styleElement.id =
    NAVBAR_STYLE_ID;

  styleElement.textContent =
    NAVBAR_FLOATING_STYLES;

  document.head.appendChild(
    styleElement
  );
}


/*
  Style dipasang satu kali saja.
  Tidak ikut dibuat ulang ketika route berubah.
*/
installNavbarStyles();


function Navbar() {
  const location =
    useLocation();

  const navbarRef =
    useRef(null);

  const scrollFrameRef =
    useRef(null);

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    dropdownOpen,
    setDropdownOpen,
  ] = useState(false);

  const [
    mobileDropdownOpen,
    setMobileDropdownOpen,
  ] = useState(false);

  const [
    isMobileViewport,
    setIsMobileViewport,
  ] = useState(
    () =>
      typeof window !== "undefined"
      && window
        .matchMedia(
          MOBILE_MEDIA_QUERY
        )
        .matches
  );

  const [
    isScrolled,
    setIsScrolled,
  ] = useState(
    () =>
      typeof window !== "undefined"
      && window.scrollY > 20
  );


  const isBangunRuangPage =
    location.pathname.startsWith(
      "/bangun-ruang"
    );


  const closeMenus =
    useCallback(() => {
      setMobileOpen(false);
      setDropdownOpen(false);
      setMobileDropdownOpen(false);
    }, []);


  useLayoutEffect(() => {
    /*
      Status scroll disamakan sebelum browser melukis,
      sehingga navbar tidak berubah warna sesaat.
    */

    setIsScrolled(
      window.scrollY > 20
    );

    closeMenus();
  }, [
    closeMenus,
    location.pathname,
  ]);


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
        Menu ditutup ketika layar berubah
        dari HP ke desktop atau sebaliknya.
      */
      closeMenus();
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
  }, [closeMenus]);


  useEffect(() => {
    function updateScrollState() {
      scrollFrameRef.current =
        null;

      const nextValue =
        window.scrollY > 20;

      setIsScrolled(
        (currentValue) =>
          currentValue
          === nextValue
            ? currentValue
            : nextValue
      );
    }


    function handleScroll() {
      if (
        scrollFrameRef.current
        !== null
      ) {
        return;
      }

      scrollFrameRef.current =
        window.requestAnimationFrame(
          updateScrollState
        );
    }


    updateScrollState();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      if (
        scrollFrameRef.current
        !== null
      ) {
        window.cancelAnimationFrame(
          scrollFrameRef.current
        );
      }
    };
  }, []);


  useEffect(() => {
    function closeOutside(
      event
    ) {
      if (
        navbarRef.current
        && !navbarRef.current.contains(
          event.target
        )
      ) {
        closeMenus();
      }
    }


    function closeWithEscape(
      event
    ) {
      if (
        event.key === "Escape"
      ) {
        closeMenus();
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
    };
  }, [closeMenus]);


  useEffect(() => {
    /*
      Saat menu HP terbuka, halaman di belakang
      tidak ikut bergeser. Style dikembalikan
      seperti semula ketika menu ditutup.
    */

    if (
      !isMobileViewport
      || !mobileOpen
    ) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    isMobileViewport,
    mobileOpen,
  ]);


  function desktopClass({
    isActive,
  }) {
    return [
      "vertex-menu-item",

      isActive
        ? "vertex-menu-active"
        : "",
    ]
      .filter(Boolean)
      .join(" ");
  }


  function mobileClass({
    isActive,
  }) {
    return [
      "vertex-mobile-item",

      isActive
        ? "vertex-mobile-active"
        : "",
    ]
      .filter(Boolean)
      .join(" ");
  }


  return (
    <nav
      ref={navbarRef}
      className={[
        "vertex-navbar",
        "vertex-navbar--floating",

        isScrolled
          ? "vertex-navbar--scrolled"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Navigasi utama"
    >
      <NavLink
        to="/"
        className="vertex-logo-link"
        aria-label="Beranda VertexAR"
        onClick={closeMenus}
      >
        <img
          src={logo}
          alt="Logo VertexAR"
          className="vertex-logo"
          draggable="false"
        />
      </NavLink>


      <div className="vertex-menu-desktop">
        <NavLink
          to="/"
          end
          className={
            desktopClass
          }
          onClick={
            closeMenus
          }
        >
          Beranda
        </NavLink>

        <NavLink
          to="/augmented-reality"
          className={
            desktopClass
          }
          onClick={
            closeMenus
          }
        >
          Augmented Reality
        </NavLink>

        <div className="vertex-nav-dropdown">
          <button
            type="button"
            className={[
              "vertex-menu-item",
              "vertex-dropdown-trigger",

              isBangunRuangPage
                ? "vertex-menu-active"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() =>
              setDropdownOpen(
                (currentValue) =>
                  !currentValue
              )
            }
            aria-expanded={
              dropdownOpen
            }
            aria-haspopup="menu"
          >
            <span>
              Bangun Ruang
            </span>

            <ChevronDown
              size={16}
              strokeWidth={2.8}
              className={[
                "vertex-dropdown-arrow",

                dropdownOpen
                  ? "vertex-dropdown-arrow-open"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          </button>

          {dropdownOpen && (
            <div
              className="vertex-nav-dropdown-menu"
              role="menu"
            >
              {DROPDOWN_ITEMS.map(
                (item) => {
                  const isActive =
                    location.pathname
                    === item.path;

                  return (
                    <NavLink
                      key={
                        item.path
                      }
                      to={
                        item.path
                      }
                      role="menuitem"
                      className={[
                        "vertex-dropdown-link",

                        isActive
                          ? "vertex-dropdown-link-active"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={
                        closeMenus
                      }
                    >
                      {item.label}
                    </NavLink>
                  );
                }
              )}
            </div>
          )}
        </div>

        <NavLink
          to="/latihan"
          className={
            desktopClass
          }
          onClick={
            closeMenus
          }
        >
          Latihan
        </NavLink>

        <NavLink
          to="/tentang"
          className={
            desktopClass
          }
          onClick={
            closeMenus
          }
        >
          Tentang
        </NavLink>
      </div>


      {!isMobileViewport && (
        <div className="vertex-navbar-reminder">
          <StudyBreakReminder />
        </div>
      )}


      <button
        type="button"
        className="vertex-mobile-button"
        onClick={() => {
          setMobileOpen(
            (currentValue) =>
              !currentValue
          );

          setDropdownOpen(false);
        }}
        aria-label={
          mobileOpen
            ? "Tutup menu navigasi"
            : "Buka menu navigasi"
        }
        aria-expanded={
          mobileOpen
        }
        aria-controls="vertex-mobile-navigation"
      >
        {mobileOpen ? (
          <X
            size={27}
            aria-hidden="true"
          />
        ) : (
          <Menu
            size={27}
            aria-hidden="true"
          />
        )}
      </button>


      {mobileOpen && (
        <div
          id="vertex-mobile-navigation"
          className="vertex-menu-mobile"
        >
          <NavLink
            to="/"
            end
            className={
              mobileClass
            }
            onClick={
              closeMenus
            }
          >
            Beranda
          </NavLink>

          <NavLink
            to="/augmented-reality"
            className={
              mobileClass
            }
            onClick={
              closeMenus
            }
          >
            Augmented Reality
          </NavLink>

          <button
            type="button"
            className={[
              "vertex-mobile-item",
              "vertex-mobile-dropdown-trigger",

              isBangunRuangPage
                ? "vertex-mobile-active"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() =>
              setMobileDropdownOpen(
                (currentValue) =>
                  !currentValue
              )
            }
            aria-expanded={
              mobileDropdownOpen
            }
          >
            <span>
              Bangun Ruang
            </span>

            <ChevronDown
              size={16}
              className={[
                "vertex-dropdown-arrow",

                mobileDropdownOpen
                  ? "vertex-dropdown-arrow-open"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-hidden="true"
            />
          </button>

          {mobileDropdownOpen && (
            <div className="vertex-mobile-submenu">
              {DROPDOWN_ITEMS.map(
                (item) => {
                  const isActive =
                    location.pathname
                    === item.path;

                  return (
                    <NavLink
                      key={
                        item.path
                      }
                      to={
                        item.path
                      }
                      className={[
                        "vertex-mobile-submenu-link",

                        isActive
                          ? "vertex-mobile-active"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={
                        closeMenus
                      }
                    >
                      {item.label}
                    </NavLink>
                  );
                }
              )}
            </div>
          )}

          <NavLink
            to="/latihan"
            className={
              mobileClass
            }
            onClick={
              closeMenus
            }
          >
            Latihan
          </NavLink>

          <NavLink
            to="/tentang"
            className={
              mobileClass
            }
            onClick={
              closeMenus
            }
          >
            Tentang
          </NavLink>

          {isMobileViewport && (
            <div className="vertex-mobile-reminder-area">
              <StudyBreakReminder />
            </div>
          )}
        </div>
      )}
    </nav>
  );
}


export default Navbar;