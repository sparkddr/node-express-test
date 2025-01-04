import express from "express";
import { getUserById, getUsers, updateUser } from "../controllers/users.controller";
import { asyncRouteHandler } from "../utils/asyncRouteHandler";

const router = express.Router()

router.get('/', asyncRouteHandler(getUsers));
router.get('/:id', asyncRouteHandler(getUserById))
router.patch('/:id', asyncRouteHandler(updateUser))

export default router