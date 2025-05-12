export const createOrderProcessBackground = (data, login_data = '') => {
  const { finished, done, quantity, colors_by_users: colors, color, backlog } = data;
  const COLOR_FOR_DONE_PROCESSES = '#E8E9EB';
  const createBackgroundForOneColor = (selectedColor) =>
    `linear-gradient(to left, ${selectedColor} 0% 100%)`;

  if (done) return createBackgroundForOneColor(COLOR_FOR_DONE_PROCESSES);
  if (login_data === 'user') {
    if (!colors?.length) return 'rgba(255,255,255,1)';
    if (colors?.length && !backlog) {
      let gradientLine = `linear-gradient(to left, `;
      let currentPercentage = 0;
      const colorsQuantity = colors.length;
      const oneColorPercentage = 100 / colorsQuantity;
      for (let i = 0; i < colorsQuantity; i++) {
        const currentColor = colors[i];
        gradientLine = `${gradientLine} ${currentColor} ${currentPercentage}% ${(currentPercentage += oneColorPercentage)}% ${
          i === colorsQuantity - 1 ? '' : ','
        }`;
      }
      gradientLine += ')';
      return gradientLine;
    } else if (backlog) {
      return `linear-gradient(45deg,${color} 25%,transparent 25%,transparent 50%,${color}  50%,${color}  75%,transparent 75%,transparent)`;
    }
  }
  return createBackgroundForOneColor(color);
};

export const createOrderProcessForM_RBackground = (data, login_data) => {
  const { proccess, user } = data;
  let COLOR_FOR_PROCESSES = '#E8E9EB'; // color for done process
  if (proccess.done) {
    return COLOR_FOR_PROCESSES;
  }
  if (login_data === 'user') {
    COLOR_FOR_PROCESSES = user.color;
    return COLOR_FOR_PROCESSES;
  }
  COLOR_FOR_PROCESSES = data.colors_by_users.join('');
  return COLOR_FOR_PROCESSES;
};
