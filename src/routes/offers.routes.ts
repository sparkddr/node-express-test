import express from "express";
import { getOffers } from "../controllers/offer.controller";
import { asyncRouteHandler } from "../utils/asyncRouteHandler";

const router = express.Router();

router.get("/", asyncRouteHandler(getOffers));

export default router;
