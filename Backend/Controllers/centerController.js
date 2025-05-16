import Center from "../Models/centerModel.js";
import centerService from "../Services/centerService.js";

class CenterController{

    async postCenter(req,res){
       try {
       const {name, street,city,pincode,isActive}=req.body

       if (!name || !street || !city || !pincode) return res.status(400).json({ message: 'required field is empty' });

        const centerDetails = await centerService.addCenter(name, street,city,pincode,isActive)
        const message=centerDetails.alreadyExist?"Center already exist":"Center added successfully"

        return res.status(201).json({success:true, message,centerDetails});
       } catch (error) {
        return res.status(500).json({ message: "Error adding Center", error: error.message });
     
       }
    
    }

    async getCenters(req,res){
        const {search, page=1, limit=10}=req.query
        try {
           
            const centers = await centerService.fetchCenters(search, Number(page),Number(limit));
            return res.status(200).json({ success: true, ...centers });

            
        } catch (error) {
            return res.status(500).json({message:"error in fetching center",error:error.message})
        }


    }



}

export default new CenterController()