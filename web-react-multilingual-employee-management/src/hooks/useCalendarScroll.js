import { useEffect } from 'react';
import { useScrollDirection } from 'react-use-scroll-direction';

export const useCalendarScroll = (element, addItemsCb) => {
  const { isScrollingLeft } = useScrollDirection(element?.current);
  const scrollWidth = element?.current?.scrollWidth;
  const clientWidth = element?.current?.clientWidth;
  const scrolledLeft = element?.current?.scrollLeft;

  const scrolledToEnd = scrollWidth === clientWidth + -scrolledLeft;

  useEffect(() => {
    scrolledToEnd && addItemsCb(true);
  }, [scrolledToEnd, , isScrollingLeft]);

  // -----------------

  //     let mouseDown = false;
  //     let startX = null
  //     let scrollLeft = null

  // const  startDragging = function (e) {
  //   mouseDown = true;
  //   startX = e.pageX - element.current.offsetLeft;
  //   scrollLeft = element.current.scrollLeft;
  // };
  // const stopDragging = function (event) {
  //   mouseDown = false;
  // };

  // const mouseMove = (e) => {
  //     e.preventDefault();
  //     if(!mouseDown) { return; }
  //     const x = e.pageX - element.current.offsetLeft;
  //     const scroll = x - startX;
  //     element.current.scrollLeft = scrollLeft - scroll;
  // }

  //     useEffect(()=>{
  //         if(element?.current){
  //             element.current.addEventListener('mousedown', startDragging, false);
  //             element.current.addEventListener('mouseup', stopDragging, false);
  //             element.current.addEventListener('mouseleave', stopDragging, false);
  //             element.current.addEventListener('mousemove', mouseMove, false )
  //             // return ()=> {
  //             //     element.current.removeEventListener('mousedown', startDragging, false);
  //             //     element.current.removeEventListener('mouseup', stopDragging, false);
  //             //     element.current.removeEventListener('mouseleave', stopDragging, false);
  //             //     element.current.removeEventListener('mousemove', mouseMove, false )
  //             // }
  //         }
  //     }, [element])
};
