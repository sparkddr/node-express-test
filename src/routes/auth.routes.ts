import  express  from "express";
import { loginUser } from "../controllers/auth.controller";
import { asyncRouteHandler } from "../utils/asyncRouteHandler";
import { createUser } from "../controllers/users.controller";

const router = express.Router()

router.post('/login', asyncRouteHandler(loginUser))
router.post('/signup', asyncRouteHandler(createUser))

export default router