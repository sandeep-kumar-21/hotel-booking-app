import User from '../models/User.js'

// Middleware to check if user is authenticated
export const protect = async (req,res,next) => {
    const auth = req.auth();
    const { userId } = auth;
    if(!userId){
        res.json({success: false, message: "not authenticated"})
    }else{
        const user = await User.findById(userId);
        req.user = user;
        next();
    }
}