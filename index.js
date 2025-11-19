import express from "express";

const app = express();

app.use(express.json());

//DATA DUMMY 
let dataDummy = [
    {id:1, title:"Pemrograman JavaScript untuk Pemula", status: "Tersedia"},
    {id:2, title:"Belajar Node.js dalam 7 Hari", status: "Tersedia"},
    {id:3, title:"Algoritma & Struktur Data Modern", status: "Tersedia"},
    {id:4, title:"Dasar–Dasar Jaringan Komputer", status: "Tersedia"},
    {id:5, title:"Pengenalan Database dengan MySQL", status: "Tersedia"},
]

//GET ALL ID
app.get("/books", (req, res) => {
    res.status(200).json({
      buku: dataDummy
    });
  });



//GET by ID
app.get("/books/:id", (req,res) => {
  const {id} = req.params;
  const userID = dataDummy.find((item) => item.id == id);
  if (!userID){
    return res.status(404).json({
      msg : "Buku Tidak Tersedia"
    });     
  }

  console.log(userID);
  res.status(200).json({ 
    buku : userID
  })
})

//POST
app.post('/books', (req, res) => {
    const { title } = req.body;
    try {
      dataDummy.push({
        id: dataDummy.length + 1,
        title: title,
        status:"Tersedia"
      })
  
      res.status(201).json({
        msg: "Buku Baru ditambahkan",
        data: dataDummy.at(-1)
      })
    } catch (error) {
         res.status(500).json({
        msg: error,
      })
    }
  });

// DELETE
app.delete("/books/:id", (req, res) => {
    const  id = Number(req.params.id);
     dataDummy = dataDummy.filter((item)=> item.id !== id)
    res.status(200).json({
        msg : "Buku berhasil Dihapus"
    })
  });
  
  
  // PUT (update title/status)
  app.put("/books/:id", (req, res) => {
    const { id } = req.params;
    const book = dataDummy.find((item) => item.id == id);
  
    if (!book) {
      return res.status(404).json({ msg: "Buku tidak ditemukan" });
    }
  
    // update title 
    if (req.body.title) book.title = req.body.title;
  
    // update status 
    if (req.body.status) {
      if (req.body.status !== "Tersedia" && req.body.status !== "Dipinjam") {
        return res.status(400).json({ msg: "Status tidak valid" });
      }
      book.status = req.body.status;
    }
    res.status(200).json({ msg: "Buku diperbarui", data: book });
  });
  
  
  // PINJAM BUKU
  app.put("/books/:id/pinjam", (req, res) => {
    const { id } = req.params;
    const book = dataDummy.find((item) => item.id == id);
  
    if (!book) return res.status(404).json({ msg: "Buku tidak ditemukan" });
  
    if (book.status === "Dipinjam") {
      return res.status(400).json({ msg: "Buku sedang dipinjam, tidak bisa dipinjam lagi" });
    }
  
    book.status = "Dipinjam";
  
    res.status(200).json({
      msg: "Buku berhasil dipinjam",
      data: book,
    });
  });
  
  
  // KEMBALIKAN BUKU
  app.put("/books/:id/kembalikan", (req, res) => {
    const { id } = req.params;
    const book = dataDummy.find((item) => item.id == id);
  
    if (!book) return res.status(404).json({ msg: "Buku tidak ditemukan" });
  
    book.status = "Tersedia";
  
    res.status(200).json({
      msg: "Buku berhasil dikembalikan",
      data: book,
    });
  });

app.listen(5500, () => {
  console.log("Running on http://localhost:5500")
});
