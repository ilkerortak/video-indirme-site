const express = require("express");
const path = require("path");
const ytdlp = require("yt-dlp-exec");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/download", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.send("Video linki gerekli");

  try {
    const file = "video.mp4";
    await ytdlp(url, { output: file, format: "mp4" });
    res.download(file);
  } catch (err) {
    console.error(err);
    res.send("Video indirilemedi");
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running on port " + PORT));
