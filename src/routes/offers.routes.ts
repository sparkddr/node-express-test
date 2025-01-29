import express from "express";
import { getOffers, getOfferById } from "../controllers/offer.controller";
import { asyncRouteHandler } from "../utils/asyncRouteHandler";

const router = express.Router();

router.get("/", asyncRouteHandler(getOffers));
router.get("/:id", asyncRouteHandler(getOfferById));

export default router;
