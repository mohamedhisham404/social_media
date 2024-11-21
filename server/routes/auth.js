import { Router } from "express";
import {login} from "../conrollers/auth.js";

const authRoutes = Router();

authRoutes.route("/login")
                    .post(login);

export default authRoutes;