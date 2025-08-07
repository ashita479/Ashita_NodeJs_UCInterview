const express = require("express");
const app = express();
const fetch = require('node-fetch');

const port = 3000;


app.get("/greeting",(req,res) => {
    res.send("Hello")
})

const getShowDetails = async () => {
  const res = await fetch(`https://api.tvmaze.com/singlesearch/shows?q=friends`);
  if (!res.ok) throw new Error(`error (${res.status})`);
  return res.json();
};

const getAllEpisodes = async (showId) => {
  const res = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
  if (!res.ok) throw new Error(`error (${res.status})`);
  return res.json();
};

app.get('/show-details', async (req, res) => {
  try {
    const show = await getShowDetails();
    res.status(200).json({
      id: show.id,
      name: show.name,
      code: show.code,
      status: show.status,
   
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch show details', message: error.message });
  }
});

app.get('/episodes', async (req, res) => {
  try {
    const show = await getShowDetails();
    const episodes = await getAllEpisodes(show.id);

    const cleanedEpisodes = episodes.map(ep => ({
      id: ep.id,
      name: ep.name,
      season: ep.season,
      number: ep.number,
      airdate: ep.airdate,
      runtime: ep.runtime,
      summary: ep.summary,
    }));

    res.status(200).json({ total: cleanedEpisodes.length, episodes: cleanedEpisodes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch episodes', message: error.message });
  }
});

app.listen(port, () => console.log(`Server started at ${port}`))
