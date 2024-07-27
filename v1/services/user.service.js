const {
  ObjectId
} = require('mongoose').Types;
const User = require("../../models/user.model")




exports.getUser = async (idOrEmail, fieldName = '_id') => {
  const data = await User.findOne({
    [fieldName]: `${idOrEmail}`
  }).lean();
  return data;
};


exports.Usersave = data => new User(data).save();

exports.deleteUser = async userId => {
  try {
    const deleteData = await User.findByIdAndDelete(userId)
    return deleteData
  } catch (err) {
    throw err
  }
}


exports.updateUser = async (conditionData, updateData) => {
  try {
    const {
      nModified
    } = await User.update(
      conditionData, {
        $set: updateData
      }, {
        runValidators: true
      }
    )

    return nModified
  } catch (err) {
    throw err
  }
}
