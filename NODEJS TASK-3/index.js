const express = require("express")
const app = express()
const mongoose = require("mongoose")
const fetch = require("node-fetch");


// Schema
const epiSchema = new mongoose.Schema({
     id:{
        type : Number,
        required : true,
        
     },
     name:{
        type : String,
        required : true,
     },
     season:{
        type : Number,
        required : true,   
     },
     number:{
        type : Number,
        required : true,
    },
     airdate:{
        type : String,
        required : true, 
     },
     summary:{
        type : String,
        required : true,
     }
})

const epi = mongoose.model('episode',epiSchema);

// connect mongoose
mongoose.connect('mongodb://127.0.0.1:27017/friends')
.then(()=>console.log("Mongodb is connected"))
.catch(err => console.log("Mongo Error",err))




async function nowindatabase() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows/431/episodes"); 
    const episodes = await response.json(); 

    
    for (const ep of episodes) {
   
      await epi.create({
        id: ep.id,
        name: ep.name,
        season: ep.season,  
        number: ep.number,
        airdate: ep.airdate, 
        summary: ep.summary || "No summary provided"
      });
    }

    console.log("All episodes saved to MongoDB!");
  } catch (err) {
    console.error("Error fetching or saving:", err.message);
  }
}


nowindatabase();


app.get('/', (req, res) => {
  res.send('Hello on port 8000!');
});

// routes as asked

app.get('/api/episodes', async (req, res) => {
  try {
    const episodes = await epi.find();
    res.status(200).json({ total: episodes.length, episodes });
  } catch (err) {
    res.status(500).json({ error: 'COULD NOT GET EPISODES' });
  }
});

app.get('/api/episodes/:id', async (req, res) => {
  try {
    const episode = await epi.findOne({ id: parseInt(req.params.id) });

    if (!episode) {
      return res.status(404).json({ error: "NO SUCH EPISODE" });
    }

    res.status(200).json(episode);
  } catch (err) {
    res.status(500).json({ error: 'COULDN NOT GET REQUESTED EPISODE' });
  }
});

app.use(express.json());

app.post('/api/episodes', async (req, res) => {
  try {
    const newEp = await epi.create(req.body);
    res.status(201).json({ message: "EPISODE ADDED", episode: newEp });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.listen(8000, () => {
  console.log("Server is running at http://localhost:8000");
});
