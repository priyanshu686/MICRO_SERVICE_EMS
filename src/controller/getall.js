/**
 * 
 * @param {import('@prisma/client').PrismaClient} prisma 
 * @param {String} model
 * @returns {Promise<Object[]>} 
 */

export const getall =async(prisma,model)=>{
    try{
        const records=await prisma[model].findMany();
        return records;
    }catch(err){
        throw new Error(`Error fetching records from ${model}: ${err.message}`);
    }
}