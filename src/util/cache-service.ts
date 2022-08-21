const TTL = 30;

export const cache = (url: string, data: any) => {
  localStorage.setItem(
    url,
    JSON.stringify({
      timestamp: Date.now(),
      data,
    })
  );
};

export const retrieve = (key: string): any => {
  try {
    const { timestamp, data } = JSON.parse(localStorage.getItem(key) || "{}");

    if (timestamp + TTL * 1000 > Date.now()) {
      return data;
    }
  } catch (error) {
    return null;
  }
};
