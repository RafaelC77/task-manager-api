import fs from "node:fs/promises";
import { parse } from "csv-parse";

(async () => {
  const content = await fs.readFile("data.csv", "utf-8");
  const parser = parse(content, { bom: true, columns: true });

  for await (const line of parser) {
    const { title, description } = line;
    console.log(line);

    const data = {
      title,
      description,
    };

    await fetch("http://localhost:3333/tasks", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    }).catch((error) => console.log(error));
  }
})();
