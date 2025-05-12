import { useRef, useEffect } from 'react';

export const useAnnualViewScroll = (scrollable) => {
  // // scroll on drag ************************************************************************
  const dragScrollable = useRef({
    mouseDown: false,
    startX: null,
    scrollLeft: null,
  });

  const startDragging = function (e) {
    if (e.defaultPrevented) {
      return;
    }
    dragScrollable.current.mouseDown = true;
    dragScrollable.current.startX = e.pageX - scrollable.current.offsetLeft;
    dragScrollable.current.scrollLeft = scrollable.current.scrollLeft;
  };
  const stopDragging = function (event) {
    if (event.defaultPrevented) {
      return;
    }
    dragScrollable.current.mouseDown = false;
  };

  const mouseMove = (e) => {
    if (e.defaultPrevented) {
      return;
    }
    // e.preventDefault();
    if (!dragScrollable.current.mouseDown) {
      return;
    }
    const x = e.pageX - scrollable.current.offsetLeft;
    const scroll = x - dragScrollable.current.startX;
    scrollable.current.scrollLeft = dragScrollable.current.scrollLeft - scroll;
  };

  useEffect(() => {
    if (scrollable?.current) {
      scrollable.current.addEventListener('mousedown', startDragging, false);
      scrollable.current.addEventListener('mouseup', stopDragging, false);
      scrollable.current.addEventListener('mouseleave', stopDragging, false);
      scrollable.current.addEventListener('mousemove', mouseMove, false);
      return () => {
        scrollable.current.removeEventListener('mousedown', startDragging, false);
        scrollable.current.removeEventListener('mouseup', stopDragging, false);
        scrollable.current.removeEventListener('mouseleave', stopDragging, false);
        scrollable.current.removeEventListener('mousemove', mouseMove, false);
      };
    }
  }, [scrollable.current]);
  // ****************************************************************************
  return dragScrollable;
};
