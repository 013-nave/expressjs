import express from "express";

const app = express();
app.use(express.json());

let dataDummy = [
  { id: 1, title: "Buku PPKn", isBorrowed: false, borrowedBy: null },
  { id: 2, title: "Buku Matematika", isBorrowed: false, borrowedBy: null },
  { id: 3, title: "Buku Bahasa Indonesia", isBorrowed: false, borrowedBy: null },
  { id: 4, title: "Buku Bahasa Inggris", isBorrowed: false, borrowedBy: null },
  { id: 5, title: "Buku PAI", isBorrowed: false, borrowedBy: null }
];


// ======================
//       READ ALL
// ======================
app.get("/books", (req, res) => {
  res.json({
    msg: "success",
    data: dataDummy,
  });
});


// ======================
//       READ BY ID
// ======================
app.get("/books/:id", (req, res) => {
  const { id } = req.params;
  const book = dataDummy.find((item) => item.id == id);

  if (!book) {
    return res.status(404).json({
      msg: "Book not found",
      data: null,
    });
  }

  res.json({
    msg: "success",
    data: book,
  });
});


// ======================
//        CREATE
// ======================
app.post("/books", (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ msg: "Title is required" });
  }

  const newBook = {
    id: dataDummy.length ? dataDummy[dataDummy.length - 1].id + 1 : 1,
    title,
    isBorrowed: false,
    borrowedBy: null,
  };

  dataDummy.push(newBook);

  res.status(201).json({
    msg: "Book created",
    data: newBook,
  });
});


// ======================
//        UPDATE
// ======================
app.put("/books/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const index = dataDummy.findIndex((item) => item.id == id);

  if (index === -1) {
    return res.status(404).json({ msg: "Book not found" });
  }

  dataDummy[index].title = title ?? dataDummy[index].title;

  res.json({
    msg: "Book updated",
    data: dataDummy[index],
  });
});


// ======================
//         DELETE
// ======================
app.delete("/books/:id", (req, res) => {
  const { id } = req.params;

  const index = dataDummy.findIndex((item) => item.id == id);

  if (index === -1) {
    return res.status(404).json({ msg: "Book not found" });
  }

  const deleted = dataDummy.splice(index, 1);

  res.json({
    msg: "Book deleted",
    data: deleted[0],
  });
});


// ======================
//     BORROW BOOK
// ======================
app.post("/books/:id/borrow", (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ msg: "userId is required" });
  }

  const book = dataDummy.find((item) => item.id == id);

  if (!book) {
    return res.status(404).json({ msg: "Book not found" });
  }

  if (book.isBorrowed) {
    return res.status(400).json({ msg: "Book is already borrowed" });
  }

  book.isBorrowed = true;
  book.borrowedBy = userId;

  res.json({
    msg: "Book borrowed successfully",
    data: book,
  });
});


// ======================
//     RETURN BOOK
// ======================
app.post("/books/:id/return", (req, res) => {
  const { id } = req.params;

  const book = dataDummy.find((item) => item.id == id);

  if (!book) {
    return res.status(404).json({ msg: "Book not found" });
  }

  if (!book.isBorrowed) {
    return res.status(400).json({ msg: "Book is not borrowed" });
  }

  book.isBorrowed = false;
  book.borrowedBy = null;

  res.json({
    msg: "Book returned successfully",
    data: book,
  });
});


app.listen(5500, () =>
  console.log("Running on http://localhost:5500")
);
