/**
 * @param {Prisma Client} prisma - Prisma client instance
 * @param {string} model - Which Table we need to use from the all Data Source Table
 * @param {Object} data - Data we need to create the Hierarachy
 * @returns {Promise<Object>} This is a reaturn Type of a function
 */


export const createUser = async(prisma,model,data)=>{
    const {prev_Id,userId} = data;
    if(!prev_Id || !userId){
        return {success:false , message: 'Missing required fields: prev_Id and userId are required'};
    }
    try{
        const checkavail = await prisma[Hierarchy].findOne({
            where:{user_Id : prev_Id}
        })
        if(!checkavail){
            return {success:false , message:"L1 of this User Dont have any Data in this"};
        }
        const checkuser = await prisma[Hierarchy].findOne({
            where:{user_Id : userId}
        })
        if(checkuser){
            return {success:false , message:"User Already have the Hierarchy"};
        }


        const create =  prisma[Hierarachy].create({
            data :{
                prev_Id : prev_Id,
                user_Id:userId,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })
        return {success:true , message:create}
    }
    catch(err){
        console.log(err.message);
        return {success:false , message:"Error creating record. ",error:err.message};
    }

}