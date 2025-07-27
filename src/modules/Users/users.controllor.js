import exprees from "express";
import * as users_serv from "./servies/Users.servies.js";
import verifytoken from "../../middlwares/auth.middlewaress.js";
import { loginRateLimit } from "../../middlwares/loginRatelimit.js";
const controllor = exprees.Router();

controllor.post("/register", users_serv.signup);
controllor.put("/confirm", users_serv.confirmOtp);
controllor.post("/login", loginRateLimit, users_serv.loginuser);
controllor.put("/update", verifytoken, users_serv.updateUser);
controllor.delete("/deleteuser", verifytoken, users_serv.deleteuser);
controllor.get("/userdata", verifytoken, users_serv.userdata);
controllor.post("/resetpasswordreq", verifytoken, users_serv.resetPasswordReq);
controllor.patch(
  "/resetpasswordconfirm",
  verifytoken,
  users_serv.resetPasswordconfirm
);

export default controllor;
