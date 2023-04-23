const ticket = {
  1: { price: 299, event: "V" },
  2: { price: 299, event: "V" },
  3: { price: 299, event: "V" },
  4: { price: 299, event: "V" },
};

const ticketRequest = [
  { id: 1, quantity: 3 },
  { id: 2, quantity: 1 },
  { id: 3, quantity: 2 },
  { id: 4, quantity: 6 },
];

let ticketsToProcess = [];

for (let tic of ticketRequest) {
  const ticketToAdd = new Array(tic.quantity).fill({
    ...tic,
    ...ticket[tic.id],
  });
  ticketsToProcess = [...ticketsToProcess, ...ticketToAdd];
}

const booking = "12356";

ticketsToProcess = ticketsToProcess.map(ticket => ({...ticket, booking}))

console.log(ticketsToProcess);
console.log(ticketsToProcess.length);
