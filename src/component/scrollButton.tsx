import { Icon } from '@iconify/react';

interface ScrollButtonProps {
  targetRef: React.RefObject<HTMLDivElement>;
  className?: string; // Optional prop for additional Tailwind CSS classes
}

export default function ScrollButton({
  targetRef,
  className = '',
}: ScrollButtonProps) {
  const scrollToElement = () => {
    // Scroll to the element referred by targetRef
    if (targetRef && targetRef.current) {
      window.scrollTo({
        top: targetRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={`cursor-pointer ${className}`} onClick={scrollToElement}>
      <Icon
        icon='ion:arrow-down-outline'
        className='text-5xl text-white animate-bounce'
      />
    </div>
  );
}
