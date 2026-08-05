import {
  useEffect,
  useRef,
  useState,
} from "react";

import "./Reveal.css";


function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}) {
  const elementRef =
    useRef(null);

  const [
    visible,
    setVisible,
  ] = useState(false);

  useEffect(() => {
    const element =
      elementRef.current;

    if (!element) {
      return undefined;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (
            entry.isIntersecting
          ) {
            setVisible(true);
            observer.unobserve(
              element
            );
          }
        },
        {
          threshold: 0.12,
          rootMargin:
            "0px 0px -35px 0px",
        }
      );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={[
        "vertex-reveal",
        `vertex-reveal--${direction}`,
        visible
          ? "vertex-reveal--visible"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        "--reveal-delay":
          `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default Reveal;