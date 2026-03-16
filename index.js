const express = require("express");
const path = require("path");
const { exec } = require("child_process");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/download", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.send("Video linki gerekli");

  // video.mp4 adıyla indir
  const file = "video.mp4";

  // yt-dlp çalıştır
  exec(`yt-dlp -f mp4 -o ${file} ${url}`, (error, stdout, stderr) => {
    if (error) {
      console.error("Video indirilemedi:", error);
      return res.send("Video indirilemedi");
    }
    res.download(file);
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running on port " + PORT));
