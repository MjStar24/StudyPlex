import User from "../Models/userModel.js";

class ActivateContoller{
    async activate(req,res){
        const {name,email,exam,Class,city,board}=req.body;
        if(!name || !email || !exam || !Class || !city || !board) return res.status(400).json({message:'All fields are required'});

        const userId=req.user._id;
        try{
            const user=await User.updateOne({_id:userId},{
                name,
                email,
                exam,
                Class,
                city,
                board,
                isActivated:true,
                role:'student',
            });
            if(user.matchedCount===0) return res.status(404).json({message:'User not found!'});

            return res.status(200).json({message:"User activated"});
        }catch(e){
            console.log(e);
            return res.status(500).json({message:"Error while activation"});
        }
    }
}

export default new ActivateContoller();