import Center from "../Models/centerModel.js";

class CenterService{
    async addCenter(name,street,city,pincode,isActive){

        try {

            const centerExist=await Center.findOne({name,"address.street": street })
            if(centerExist) return {alreadyExist:true,centerExist}
            const centerData = {
                name,
                address: {
                  street,
                  city,
                  pincode,
                },
                isActive,
              };
        
            const centerDetails = await Center.create(centerData)
            return {alreadyExist:false, centerDetails}
            
        } catch (error) {
            console.error("Error in posting center", error);
            throw error;
        }
    }

    async fetchCenters(search , page=1,limit=10){
        const skip=(page-1)*limit
        const query={}
        if(search){
            
            const regex=new RegExp(search,'i')
            query.$or=[
                {name:regex},
                {'address.city':regex},
                {'address.pincode':regex},
            ]
        }

        const [center,total] = await Promise.all([
            Center.find(query)
                .sort({createdAt:-1})
                .skip(skip)
                .limit(Number(limit)),
            Center.countDocuments(query)
        ]);
        
        return {
            center,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        }
    
    
    }



}
export default new CenterService()

