import { cn } from '@/lib/utils';
import React from 'react';

export default function Toolbar({
  children,
  startHiding,
}: {
  children: React.ReactNode;
  startHiding: boolean;
}) {
  const [isToolbarVisible, setIsToolbarVisible] = React.useState(true);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const startAutoHideTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsToolbarVisible(false);
    }, 2000);
  };

  const showToolbar = () => {
    setIsToolbarVisible(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const hideToolbar = () => {
    if (!startHiding) return;
    startAutoHideTimer();
  };

  React.useEffect(() => {
    if (startHiding) {
      startAutoHideTimer();
    }
  }, [startHiding]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={showToolbar}
      onMouseLeave={hideToolbar}
    >
      <div
        className={cn(
          'flex w-full justify-end gap-1 border-t transition-transform duration-300 ease-in-out',
          isToolbarVisible ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        {children}
      </div>
    </div>
  );
}
