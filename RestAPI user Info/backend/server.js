const express = require('express');
const app = express();
const fs = require('fs/promises');

const port = 7777;
const cors = require('cors');


app.use(cors());
app.use(express.json());

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});

app.post('/message/:name', async (req, res)=>{
    const { name, age} = req.body;
    const newFile = await fs.writeFile(`./data/${req.params.name}.json`, JSON.stringify({age, name}), 'utf8');
    if(newFile){
        return res.status(201).json({
            message : "File created"
        })
    }
    return res.status(404).json({
        message : "Error creating file"
    })
})
app.get('/admin/:name', async (req, res) => {
    try {
        const rawData = await fs.readFile(`./data/${req.params.name}.json`, 'utf8');
        const jsonData = JSON.parse(rawData);
        return res.status(200).json({ data: jsonData });
    } catch (err) {
        console.error("Error reading/parsing file:", err.message);
        return res.status(500).json({ message: "Error reading file" });
    }
});
app.delete('/delete/:name', async (req, res) => {
  try {
    const filePath = `./data/${req.params.name}.json`;
    await fs.unlink(filePath); // this will throw if file doesn't exist

    return res.status(200).json({
      message: "File deleted"
    });
  } catch (err) {
    console.error(err);
    return res.status(404).json({
      message: "Error deleting file or file not found"
    });
  }
});