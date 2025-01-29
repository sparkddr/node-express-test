import express from "express";
import { asyncRouteHandler } from "../utils/asyncRouteHandler";
import { getCities } from "../controllers/cities.controller";

const router = express.Router();

router.get("/", asyncRouteHandler(getCities));

export default router;
