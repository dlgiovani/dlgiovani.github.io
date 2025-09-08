import { useState, useEffect, useRef } from "react";

interface TypingTextProps {
  text: string;
  speed?: number;
  delay?: number;
  showCursor?: boolean;
  className?: string;
}

export function TypingText({ 
  text, 
  speed = 50, 
  delay = 0, 
  showCursor = true,
  className = ""
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;

    if (currentIndex < text.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayedText(text.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
  }, [currentIndex, text, speed, isTyping]);

  return (
    <span 
      className={className}
      role="text"
      aria-label={currentIndex >= text.length ? text : "Loading content"}
    >
      {displayedText}
      {showCursor && (isTyping && currentIndex < text.length) && (
        <span className="terminal-cursor" aria-hidden="true"></span>
      )}
    </span>
  );
}

interface CommandOutputProps {
  command: string;
  output: string;
  delay?: number;
  className?: string;
}

export function CommandOutput({ command, output, delay = 0, className = "" }: CommandOutputProps) {
  return (
    <div 
      className={`space-y-2 ${className}`}
      role="group"
      aria-label={`Terminal command: ${command}`}
    >
      <div className="terminal-prompt" role="text" aria-label={`Executing command: ${command}`}>
        <TypingText text={command} delay={delay} />
      </div>
      <div 
        className="ml-2 text-[var(--color-terminal-secondary)]"
        role="status"
        aria-label="Command output"
        aria-live="polite"
      >
        <TypingText 
          text={output} 
          delay={delay + (command.length * 50) + 500}
          showCursor={false}
        />
      </div>
    </div>
  );
}