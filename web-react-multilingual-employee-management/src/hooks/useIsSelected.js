import React, { useState, useEffect } from 'react';

export const useIsSelected = (currentId, selectedId) => {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (currentId === selectedId) setSelected(true);
    else setSelected(false);
  }, [currentId, selectedId]);

  return selected;
};
