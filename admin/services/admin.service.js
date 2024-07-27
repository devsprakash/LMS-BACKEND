const User = require("../../models/user.model")


exports.getUser = async (idOrEmail, fieldName = '_id') => {
    const data = await User.findOne({
      [fieldName]: `${idOrEmail}`
    });
    return data;
  };

exports.save = data => new User(data).save();
