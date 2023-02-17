import http from "node:http";
import { randomUUID } from "node:crypto";

const tasks = [];

const server = http.createServer(async (req, res) => {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch {
    req.body = null;
  }

  if (req.method === "POST" && req.url === "/task") {
    const { title, description } = req.body;

    const task = {
      id: randomUUID(),
      title,
      description,
      completed_at: null,
      created_at: new Date(),
      updated_at: null,
    };

    tasks.push(task);

    return res.writeHead(201).end();
  }

  if (req.method === "GET" && req.url === "/task") {
    res.end(JSON.stringify(tasks));
  }

  return res.writeHead(404).end();
});

server.listen(3333);
