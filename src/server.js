import http from "node:http";
import { randomUUID } from "node:crypto";
import { json } from "./middlewares/json.js";
import { Database } from "./middlewares/database.js";

const database = new Database();

const server = http.createServer(async (req, res) => {
  await json(req, res);

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

    database.insert("tasks", task);

    return res.writeHead(201).end();
  }

  if (req.method === "GET" && req.url === "/task") {
    const tasks = database.select("tasks");

    return res.end(JSON.stringify(tasks));
  }

  return res.writeHead(404).end();
});

server.listen(3333);
