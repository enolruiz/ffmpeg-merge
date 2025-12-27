import express from "express";
import fetch from "node-fetch";
import fs from "fs";
import { exec } from "child_process";

const app = express();
app.use(express.json());

app.post("/merge", async (req, res) => {
  try {
    const { files, output = "merged.mp3" } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }

    // Descargar audios
    for (let i = 0; i < files.length; i++) {
      const response = await fetch(files[i]);
      const buffer = await response.arrayBuffer();
      fs.writeFileSync(`audio_${i}.mpeg`, Buffer.from(buffer));
    }

    // Crear lista para ffmpeg
    const list = files.map((_, i) => `file 'audio_${i}.mpeg'`).join("\n");
    fs.writeFileSync("list.txt", list);

    // Ejecutar ffmpeg
    exec(
      `ffmpeg -y -f concat -safe 0 -i list.txt -acodec libmp3lame ${output}`,
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "FFmpeg failed" });
        }

        res.sendFile(`${process.cwd()}/${output}`);
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("FFmpeg merge service running on port", PORT);
});
