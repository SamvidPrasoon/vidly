const admin = function(req,res,next){
    if(!req.user.isadmin){
        return res.status(403).json({
            msg:`access denied`
        })
    }
    next();
}
module.exports  = admin