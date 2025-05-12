import React from 'react';

export const useInfiniteScroll = (fetchData) => {
  const [isFetching, setIsFetching] = React.useState(true);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    if (!isFetching) return;
    fetchData();
  }, [isFetching]);

  function handleScroll() {
    let pos =
      (document.documentElement.scrollTop || document.body.scrollTop) +
      document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
    if (Math.round(pos) === max - 1 || Math.round(pos) === max) {
      setIsFetching(true);
    }
  }

  return [isFetching, setIsFetching];
};
