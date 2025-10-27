/**
 * @param {import('@prisma/client').PrismaClient} prisma - Prisma client instance
 * @param {string} model - Which Table we need to use from the all Data Source Table
 * @param {Object} data - Data we need to create the Hierarchy
 * @returns {Promise<Object>} This is a return type of a function
 */

const createUser = async (prisma, model, data) => {
  const { prev_Id, user_Id } = data;

// Convert after destructuring
const prevId = parseInt(prev_Id, 10);
const userId = parseInt(user_Id, 10);
console.log('Parsed prevId:', prevId);
console.log('Parsed userId:', userId);

  if (!prevId || !userId) {
    return { success: false, message: 'Missing required fields: prev_Id and userId are required' };
  }

  try {
    const checkavail = await prisma[model].findFirst({
      where: { user_Id: prevId },
    });

    if (!checkavail) {
      return { success: false, message: "L1 of this User doesn't have any data in this" };
    }

    const checkuser = await prisma[model].findFirst({
      where: { user_Id: userId },
    });

    if (checkuser) {
      return { success: false, message: 'User already has the hierarchy' };
    }

    const create = await prisma[model].create({
      data: {
        prev_Id:prevId,
        user_Id: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return { success: true, message: create };
  } catch (err) {
    console.error(err.message);
    return { success: false, message: 'Error creating record.', error: err.message };
  }
};

module.exports = { createUser };
