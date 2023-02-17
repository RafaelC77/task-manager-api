import http from "node:http";
import { randomUUID } from "node:crypto";

const tasks = [];

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/task") {
    const task = {
      id: randomUUID(),
      title: "Título da Tarefa",
      description: "Descrição da tarefa.",
      completed_at: null,
      created_at: new Date(),
      updated_at: null,
    };

    tasks.push(task);

    console.log(tasks);

    return res.writeHead(201).end();
  }

  return res.writeHead(404).end();
});

server.listen(3333);
