const express = require("express");
const path = require("path");
const fs = require("fs");
const ytdl = require("ytdl-core");

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
    // URL geçerli mi kontrol et
    if (!ytdl.validateURL(url)) return res.send("Geçersiz YouTube linki");

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[\/\\?%*:|"<>]/g, '-'); // geçersiz karakterleri temizle
    const file = `${title}.mp4`;

    res.header('Content-Disposition', `attachment; filename="${file}"`);

    ytdl(url, { format: 'mp4' }).pipe(res);

  } catch (err) {
    console.error(err);
    res.send("Video indirilemedi");
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running on port " + PORT));
