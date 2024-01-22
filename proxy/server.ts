// Bun.serve({
//   port: 2999,
//   fetch(req) {
//     console.log(req.body);
//     console.log(req.url);
//     console.log(req.method);
//     return new Response("Ok");
//   },
// });

Bun.listen({
  hostname: "localhost",
  port: 2999,
  socket: {
    data(socket, data) {
      console.log("data", data);
    }, // message received from client
    open(socket) {
      console.log("open");
    }, // socket opened
    close(socket) {}, // socket closed
    drain(socket) {}, // socket ready for more data
    error(socket, error) {
      console.log("error", error);
    }, // error handler
  },
});
