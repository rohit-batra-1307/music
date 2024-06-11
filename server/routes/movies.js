import { Router } from "express";
import { getMovies,getMovie, createMovie, editMovie, deleteMovie} from "../controllers/movies.js";

const router = Router();
import authentication from "../middlewares/authentication.js";

router.get("/:userId", getMovies);
router.get("/:userId/:value", getMovie);
router.post("/", authentication, createMovie);
router.patch("/:id", authentication, editMovie);
router.delete("/:id", authentication, deleteMovie);

export default router;