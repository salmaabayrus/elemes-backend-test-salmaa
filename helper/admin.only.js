import Users from "../models/user.model.js";

export const adminOnly = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401);
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });
        if (!user[0]) return res.sendStatus(403);
        if (user[0].role !== 'admin') return res.status(403).json({msg: "Akses terlarang"});
        next();
};