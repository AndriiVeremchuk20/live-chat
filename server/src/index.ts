import express, {Request, Response} from "express"
import http from "http";
import { Server } from "socket.io";
import cors from "cors"
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 5000;

cors();

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

io.on('connection', (socket)=>{console.log("User is connected")})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
