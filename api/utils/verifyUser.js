import jwt  from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookie.access_token;

    if(!token) return res.status(401).json("You need to login");
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return res.status(403).json("Invalid Token");

        req.user = user;
        next();
    }) 
}