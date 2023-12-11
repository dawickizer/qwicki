export const generateRandomUUID = (): string => {
  const hexDigits = '0123456789abcdef';
  let objectId = '';
  for (let i = 0; i < 24; i++) {
    objectId += hexDigits[Math.floor(Math.random() * 16)];
  }
  return objectId;
};
