const express = require('express');
    const cors = require('cors');
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());   
app.use(express.json());

//Create a restful api to perform crud operations.
/*
1.file create with external body
2.get file data
3.update or modify file data 
4.delete file
*/

app.post('/create',  (req, res) => {
    const { filename, data } = req.body;

    const newFile = fs.writeFile(`data/counter/${filename}.txt`, data, 'utf8');
    if(newFile){
        return res.status(201).json({
            message : "File Created"
        })
    }else{
        return res.status(403).json({
            message : "Error creating file"
        })
        }
});
app.get('/read/:name', async (req, res)=>{
    const { name } = req.params
    const data = await fs.readFile(`data/counter/${name}.txt`,'utf8');
    console.log("dta: ", data)
    if(data){
        return res.status(200).json({
            data
        })
    }else{
        return res.status(500).json({
            message : "Not reading"
        })
    }
} )
app.put("/update/:name", async (req, res)=>{
    const { name } = req.params;
    const { data } = req.body;
    const fileExist = fs.readFile(`data/counter/${name}.txt`, 'utf8');
    if(!fileExist){
        return res.status(404).json({
            message : "File not found"
        })
    }else{
        await fs.writeFile(`data/counter/${name}.txt`,data, 'utf8',(err)=>{
            console.log(err);
        })
    }
})
// app.delete("/delete/:name", (req, res) => {
//     const { name } = req.params;
//     const filePath = path.join(__dirname, `data/counter/${name}.txt`);

//     fs.unlink(filePath, (err) => {
//         if (err) {
//             console.error("Error deleting file:", err);
//             return res.status(500).json({ message: "File deletion failed", error: err.message });
//         }
//         res.status(200).json({ message: `File '${name}.txt' deleted successfully` });
//     });
// });

app.listen(3000, ()=>{
    console.log("port : " + 3000);
});
