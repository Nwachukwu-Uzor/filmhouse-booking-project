export function generateBookingNumber() {
  let length = Math.random() < 0.5 ? 10 : 11; // randomly choose length of string to generate
  let result = "";
  const characters = "0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `FH-${result}`;
}
