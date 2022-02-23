import http from 'http';
import { _, toStream } from '../src/genz.mjs';

const busted = () => _.div(
  'hello',
  () => { throw new Error('oh no...') }
);

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Transfer-Encoding': 'chunked'
  });

  // TODO: explore request hanging up...

  res.on('error', (e) => { console.log(`ERROR`, e) });
  toStream(res, busted, {});

}).listen(3000, () => {
  console.log(`listening :3000`)
});

// var req = http.get("http://localhost:3000", res => {
//     console.log("Status code:", res.statusCode);

//     res.on("data", data => {
//       console.log("Received chunk:", data.toString());
//     });

//     res.on("end", () => console.log("Ended"));
//     res.on('close', () => { console.log('Closed') })
// });

// req.on("error", error => {
//   console.log("Request error:", error);
// });