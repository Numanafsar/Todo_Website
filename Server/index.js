const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const TodoModel = require("./Models/Todo");
const RegistrationDataModel = require("./Models/RegistrationData");
const NotesModel = require("./Models/Notes");
const jwt = require("jsonwebtoken");
const auth = require("./middlewares/auth");
const cron = require("node-cron");
const dotenv = require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
const mongoDB = process.env.MONGODB_URI

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(mongoDB)
  .then(() => {
    app.listen(3001, () => {
      console.log("Server is running on port 3001 and connected to DB");
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

cron.schedule("0 0 * * *", async () => {
  console.log("Running cron job to reset recurring tasks");

  try {
    const today = new Date().toISOString().split("T")[0];

    const tasks = await TodoModel.find({
      isRecurring: true,
      done: true,
      date: { $lte: today },
    });

    for (const task of tasks) {
      await TodoModel.findByIdAndUpdate(task._id, {
        $set: { done: false },
      });

      console.log(`Task ${task._id} status reset to "undone"`);
    }
  } catch (error) {
    console.error("Error resetting recurring tasks:", error.message);
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  RegistrationDataModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
          return res
            .status(200)
            .json({ message: "Login successful", token: token });
        } else {
          return res.status(401).json({ message: "Password incorrect" });
        }
      } else {
        return res.status(404).json({ message: "No record found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
});

app.post("/signup", async (req, res) => {
  const { email, name, password, confirmPassword, Notes_id, Todos_id } =
    req.body;

  try {
    const existingUser = await RegistrationDataModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const newUser = await RegistrationDataModel.create({
      email,
      name,
      password,
      Notes_id,
      Todos_id,
    });
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/notes", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const notes = await NotesModel.find({ userId });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).send("Error fetching notes: " + error.message);
  }
});

app.post("/notes", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { title, description, date } = req.body;
    const newNote = await NotesModel.create({
      title,
      description,
      date,
      userId,
    });
    res.status(201).json(newNote);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Creating Note", error: error.message });
  }
});

app.post("/add-note", auth, async (req, res) => {
  const { noteId } = req.body;
  const userId = req.userId;
  try {
    const user = await RegistrationDataModel.findByIdAndUpdate(
      userId,
      { $push: { Notes_id: noteId } },
      { new: true }
    );
    res.status(200).json({ message: "Note added successfully", user });
  } catch (error) {
    console.error("Error adding note:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.put("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const updatedNote = await NotesModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await NotesModel.findByIdAndDelete(id);
    if (!deletedNote) {
      return res.status(404).json({ error: "Note not found" });
    }
    await RegistrationDataModel.updateMany(
      { Notes_id: id },
      { $pull: { Notes_id: id } }
    );
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function typeToday(req, res) {
  const userId = req.userId;
  const currentDate = new Date().toISOString().split("T")[0];
  const nextDates = await TodoModel.distinct("nextDates", {
    userId,
  });
  const todoData = await TodoModel.find({
    userId,
    date: { $in: [currentDate, ...nextDates] },
  });
  const recurringData = await TodoModel.find({
    userId,
    date: { $lte: currentDate },
    recurrencePeriod: "Daily",
  });
  const combinedData = [...todoData, ...recurringData];
  const uniqueData = combinedData.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t._id.toString() === item._id.toString())
  );
  if (uniqueData.length < 1) {
    return res.status(402).json({ error: "No Data Found Today" });
  }
  return res.status(200).json({ todoData: uniqueData });
}

async function typeUpcoming(req, res) {
  const userId = req.userId;

  const currentDate = new Date();
  const startDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() + 1);
  const endDate = new Date(currentDate);
  endDate.setDate(currentDate.getDate() + 7);
  const startDateString = startDate.toISOString().split("T")[0];
  const endDateString = endDate.toISOString().split("T")[0];

  const todoData = await TodoModel.find({
    userId,
    date: { $gte: startDateString, $lte: endDateString },
  });
  const recurringData = await TodoModel.find({
    userId,
    nextDates: { $gte: startDateString, $lte: endDateString },
    recurrencePeriod: "Weekly",
  })
  const combinedData = [...todoData, ...recurringData];
  const uniqueData = combinedData.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t._id.toString() === item._id.toString())
  );
  console.log("Unique Data:", uniqueData);
  if (uniqueData.length < 1) {
    return res.status(402).json({ error: "No Data Found" });
  }
  return res.status(200).json({ todoData: uniqueData });
}

async function typeAll(req, res) {
  const userId = req.userId;
  const todoData = await TodoModel.find({ userId });
  if (todoData.length < 1) {
    return res.status(402).json({ error: "No Data Found" });
  }
  return res.status(200).json({ todoData });
}

app.get("/user", auth, async (req, res) => {
  const userId = req.userId;
  try {
    const userData = await RegistrationDataModel.findById({ _id: userId });
    if (!userData) {
      return res.status(402).json({ message: "Data not found" });
    }
    res.status(200).json({ message: "success", userData });
  } catch (error) {
    console.error("Error in /user route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get", auth, async (req, res) => {
  const { type } = req.query;
  try {
    if (type === "today") {
      return typeToday(req, res);
    }
    if (type === "upcoming") {
      return typeUpcoming(req, res);
    }
    return typeAll(req, res);
  } catch (error) {
    console.error("Error in /get route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/add", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const task = req.body.task;
    const date = req.body.date;
    const deadlineDate = req.body.deadlineDate;
    const priority = req.body.priority;
    const isRecurring = req.body.isRecurring;
    const recurrencePeriod = req.body.recurrencePeriod;
    const nextDates = [];
    if (isRecurring === true && recurrencePeriod === "Weekly") {
      let currentDate = new Date(date);
      for (let i = 0; i < 100; i++) {
        currentDate.setDate(currentDate.getDate() + 7);
        const formattedDate = currentDate.toISOString().split("T")[0];
        nextDates.push(formattedDate);
      }
    }
    if (isRecurring === true && recurrencePeriod === "Monthly") {
      let currentDate = new Date(date);
      for (let i = 0; i < 50; i++) {
        currentDate.setMonth(currentDate.getMonth() + 1);
        const formattedDate = currentDate.toISOString().split("T")[0];
        nextDates.push(formattedDate);
      }
    }

    const newTodo = await TodoModel.create({
      task,
      date,
      deadlineDate,
      priority,
      isRecurring,
      recurrencePeriod,
      nextDates,
      userId,
    });
    res.status(201).json(newTodo);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Creating Todo", error: error.message });
  }
});

app.post("/add-todo", auth, async (req, res) => {
  const { todoId } = req.body;
  const userId = req.userId;
  try {
    const user = await RegistrationDataModel.findByIdAndUpdate(
      userId,
      { $push: { Todos_id: todoId } },
      { new: true }
    );
    res.status(200).json({ message: "Todo added successfully", user });
  } catch (error) {
    console.error("Error adding todo:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTodo = await TodoModel.findByIdAndUpdate(
      id,
      { done: true },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await TodoModel.findByIdAndDelete({ _id: id });
    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    await RegistrationDataModel.updateMany(
      { Todos_id: id },
      { $pull: { Todos_id: id } }
    );
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
