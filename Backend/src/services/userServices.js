const prisma = require("../prisma/prismaclient");

const registration = async (
  name,
  email,
  password_hash,
  is_verified,
  verificationToken
) => {
  const user = await prisma.user_data.create({
    data: {
      fullname: name,
      email,
      hashpassword: password_hash,
      is_verified,
      verification_token: verificationToken,
    },
  });
  return user;
};

const verification = async (token) => {
  const user = await prisma.user_data.findFirst({
    where: { verification_token: token },
  });

  if (!user) {
    return "Invalid or expired token";
  }
  await prisma.user_data.update({
    where: { id: user.id },
    data: {
      is_verified: true,
      verification_token: "null", // Remove token after verification
    },
  });
  return "Registration and verification successfull!";
};

const getuserdata = async (email) => {
  const user = await prisma.user_data.findUnique({
    where: { email },
  });
  if (!user) {
    return false;
  }
  return user;
};

const updateProfile = async (userid, profile_pic) => {
  const updatedUser = await prisma.user_data.update({
    where: {
      id: userid, // Replace with the actual user ID
    },
    data: {
      profile_pic: profile_pic, // Replace with the new profile pic URL
    },
    select: {
      id: true,
      fullname: true, // Include other fields you want to return
      email: true,
      profile_pic: true,
    },
  });
  return updatedUser;
};
module.exports = { verification, registration, getuserdata, updateProfile };
