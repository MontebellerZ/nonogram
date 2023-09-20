import { getLevel } from "./scripts/getLevels";
import solver from "./scripts/solver";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json({ limit: "2024mb" }));
app.use(
	express.urlencoded({
		extended: true,
		type: "application/json",
		limit: "2024mb",
	})
);

app.use("/public", express.static("public"));

app.get("/non/:id", (req, res) => {
	const levelID = Number(req.params.id);

	const lvl = getLevel(levelID);
	const teste = solver(lvl);

	res.send(teste);
});

const PORT = 3000;
app.listen(PORT || 3000, () => console.log(`server running on port ${PORT}`));
