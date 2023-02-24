import { randomUUID } from "node:crypto";
import { generateRoutePath } from "../utils/generate-route-path.js";
import { Database } from "./database.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: generateRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const searchData = search
        ? {
            title: search,
            description: search,
          }
        : null;

      const tasks = database.select("tasks", searchData);

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: generateRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.writeHead(400, "Invalid request body content").end();
      }

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
    },
  },
  {
    method: "PUT",
    path: generateRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const IdExists = database.checkID("tasks", id);

      if (!IdExists) {
        return res.writeHead(404, "Id not found").end();
      }

      if (!title || !description) {
        return res.writeHead(400, "Invalid request body content").end();
      }

      database.update("tasks", id, { title, description });

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: generateRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const IdExists = database.checkID("tasks", id);

      if (!IdExists) {
        return res.writeHead(404, "Id not found").end();
      }

      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: generateRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const IdExists = database.checkID("tasks", id);

      if (!IdExists) {
        return res.writeHead(404, "Id not found").end();
      }

      database.complete("tasks", id);

      return res.writeHead(204).end();
    },
  },
];
