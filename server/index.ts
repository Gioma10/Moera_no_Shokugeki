import "dotenv/config";
import express from "express";
import cors from "cors";
import recipesRouter from "./routes/recipes.ts";
import authRouter from "./routes/auth.ts";
import adminUsersRouter from "./routes/admin/users.ts";
import shoppingListsRouter from "./routes/shopping-lists.ts";

const app = express();

app.use(cors());
app.use(express.json());

// Server Test
// app.get("/api/home", (req, res) => {
//   res.json({ message: "Hello" });
// });

// Routes
app.use("/api/recipes", recipesRouter);
app.use("/api/auth", authRouter);
app.use("/api/shopping-lists", shoppingListsRouter);

// Admin Routes
app.use("/api/admin/users", adminUsersRouter);

app.listen(8080, () => console.log("Server started on port 8080"));

