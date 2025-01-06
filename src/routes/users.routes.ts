import express from "express";
import { createUser, getProfil, getUserById, getUsers, getUsersByName, updateUser } from "../controllers/users.controller";
import { asyncRouteHandler } from "../utils/asyncRouteHandler";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router()

router.get('/',authenticate, asyncRouteHandler(getUsers));
router.get('/search', asyncRouteHandler(getUsersByName))
router.get('/profil',authenticate, getProfil)
router.get('/:id', asyncRouteHandler(getUserById))
router.patch('/:id', asyncRouteHandler(updateUser))
router.post('/',asyncRouteHandler(createUser))

export default router