export function generateIdentificationCode(length = 11, prefix) {
  let result = "";
  const characters = "0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `${prefix ? prefix + "-" : ""}${result}`;
}
