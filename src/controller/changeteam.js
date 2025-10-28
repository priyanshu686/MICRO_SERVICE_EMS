/**
 *  @param {import('@prisma/client').PrismaClient} prisma - Prisma client instance
 *  @param {string} model - Which Table we need to use from the all Data Source Table
 *  @param {Object} data - Data we need to change the Team
 *  @returns {Promise<Object>} This is a return type of a function
 */

const changeTeam = async (prisma, model, data) => {
  const { user_Id, new_prev_Id } = data;
  const userId = parseInt(user_Id, 10);
  const newPrevId = parseInt(new_prev_Id, 10);
  if (!userId || !newPrevId) {
    return {
      success: false,
      message: "Missing required fields: user_Id and new_prev_Id are required",
    };
  }
  try {
    const userRecord = await prisma[model].findFirst({
      where: { user_Id: userId },
    });

    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist in hierarchy",
      };
    }

    // Get the previous user's record
    const oldPrevId = userRecord.prev_Id;

    const prevRecord = await prisma[model].findFirst({
      where: { user_Id: oldPrevId },
    });

    if (!prevRecord) {
      return {
        success: false,
        message: "Previous user not found in hierarchy",
      };
    }

    // Remove current userId from previous user's next_Id array
    await prisma[model].update({
      where: { user_Id: oldPrevId },
      data: {
        next_Id: {
          set: prevRecord.next_Id.filter((id) => id !== userId),
        },
        updatedAt: new Date(),
      },
    });

    // Update the user record with the new previous ID
    await prisma[model].update({
      where: { user_Id: userId },
      data: {
        prev_Id: newPrevId,
        updatedAt: new Date(),
      },
    });
    // Update the new previous user's next_Id array to add the userId
    await prisma[model].update({
      where: { user_Id: newPrevId },
      data: {
        next_Id: {
          push: userId,
        },
        updatedAt: new Date(),
      },
    });
    return { success: true, message: "Team changed successfully" };
  } catch (err) {
    console.error(err.message);
    return {
      success: false,
      message: "Error changing team.",
      error: err.message,
    };
  }
};

module.exports = { changeTeam };
