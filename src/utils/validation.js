const updateProfileValidation = (req) => {
  const allowedData = [
    "firstName",
    "lastName",
    "gender",
    "age",
    "skills",
    "bio",
    "profileImg",
  ];

  const validData = Object.keys(req.body).every((key) =>
    allowedData.includes(key)
  );

  return validData;
};

const isPasswordValid = (req) => {
  const { password } = req.body;
  const valid = Object.keys(password).every((e) => password.includes(e));

  return valid;
};

module.exports = { updateProfileValidation, isPasswordValid };
