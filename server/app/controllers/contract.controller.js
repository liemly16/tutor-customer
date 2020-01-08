const ObjectId = require('mongodb').ObjectID;
const Contract = require('../models/contract.model');
const Comment = require('../models/comment.model');
const User = require('../models/user.model');
const Report = require('../models/report.model');
const UserTypes = require('../enums/EUserTypes');
const ContractTypes = require('../enums/EContractTypes');
const DefaultValues = require('../utils/default-values.utils');

exports.getContractList = (req, res) => {
  var userId = req.query.userId || '';
  var pageNumber = req.query.page || DefaultValues.pageNumber;
  var itemPerPage = req.query.limit || DefaultValues.itemPerPage;

  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = DefaultValues.pageNumber;
  } else {
    pageNumber = parseInt(pageNumber);
  }
  if (isNaN(itemPerPage) || itemPerPage < 1) {
    itemPerPage = DefaultValues.itemPerPage;
  } else {
    itemPerPage = parseInt(itemPerPage);
  }

  User.findById({ _id: ObjectId(userId) })
    .then(async user => {
      if (user) {
        if (user.typeID === UserTypes.TEACHER) {
          Contract.find({
            teacherId: ObjectId(user._id)
          })
            .skip(itemPerPage * (pageNumber - 1))
            .limit(itemPerPage)
            .then(contractList => {
              res.status(200).send({
                contract: contractList
              });
            })
            .catch(err => {
              console.log('error: ', err.message);
              res.status(500).send({
                message: 'Đã có lỗi xảy ra, vui lòng thử lại!'
              });
            });
        } else if (user.typeID === UserTypes.STUDENT) {
          Contract.find({
            studentId: ObjectId(user._id)
          })
            .skip(itemPerPage * (pageNumber - 1))
            .limit(itemPerPage)
            .then(contractList => {
              res.status(200).send({
                contract: contractList
              });
            })
            .catch(err => {
              console.log('error: ', err.message);
              res.status(500).send({
                message: 'Đã có lỗi xảy ra, vui lòng thử lại!'
              });
            });
        }
      } else {
        return res.status(400).send({ message: 'Tài khoản không tồn tại.' });
      }
    })
    .catch(err => {
      console.log('error: ', err.message);
      res.status(500).send({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại!'
      });
    });
};

exports.countContracts = async (req, res) => {
  var userId = req.query.userId || '';

  User.findById({ _id: ObjectId(userId) })
    .then(async user => {
      if (user) {
        if (user.typeID === UserTypes.TEACHER) {
          Contract.countDocuments({
            teacherId: ObjectId(user._id)
          })
            .then(quantity => {
              res.status(200).send({
                contract: quantity
              });
            })
            .catch(err => {
              console.log('error: ', err.message);
              res.status(500).send({
                message: 'Đã có lỗi xảy ra, vui lòng thử lại!'
              });
            });
        } else if (user.typeID === UserTypes.STUDENT) {
          Contract.countDocuments({
            studentId: ObjectId(user._id)
          })
            .then(quantity => {
              res.status(200).send({
                contract: quantity
              });
            })
            .catch(err => {
              console.log('error: ', err.message);
              res.status(500).send({
                message: 'Đã có lỗi xảy ra, vui lòng thử lại!'
              });
            });
        }
      } else {
        return res.status(400).send({ message: 'Tài khoản không tồn tại.' });
      }
    })
    .catch(err => {
      console.log('error: ', err.message);
      res.status(500).send({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại!'
      });
    });
};

exports.getContract = async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  try {
    if (user) {
      const contract = await Contract.findOne({ _id: id })
        .populate('teacherId', { password: 0, passwordHash: 0 })
        .populate('studentId', { password: 0, passwordHash: 0 });

      if (contract) {
        if (
          contract.teacherId._id !== user._id &&
          contract.studentId._id !== user._id
        ) {
          return res
            .status(400)
            .send({ message: 'Bạn không có quyền truy cập' });
        }
        return res.status(200).send({ payload: contract });
      } else {
        return res.status(400).send({ message: 'Hợp đồng không tồn tại.' });
      }
    } else {
      return res.status(400).send({ message: 'Tài khoản không tồn tại.' });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ message: 'Đã có lỗi xảy ra, vui lòng thử lại!' });
  }
};

exports.createContract = (req, res) => {
  const { studentId, teacherId } = req.body;

  if (studentId && teacherId) {
    const newContract = new Contract(req.body);
    newContract
      .save()
      .then(contract => {
        res.status(200).send({
          contract
        });
      })
      .catch(err => {
        console.log('error: ', err.message);
        res.status(500).send({
          message: 'Đã có lỗi xảy ra, vui lòng thử lại!'
        });
      });
  }
};

exports.sendReport = async (req, res) => {
  const { idContract, content } = req.body;
  const { user } = req;
  try {
    if (user) {
      const report = new Report();
      report.content = content;
      report.idContract = idContract;
      await report.save();

      return res
        .status(200)
        .send({ isSuccess: true, message: 'Gửi tố cáo thành công' });
    } else {
      return res
        .status(400)
        .send({ isSuccess: false, message: 'Tài khoản không tồn tại.' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      isSuccess: false,
      message: 'Đã có lỗi xảy ra, vui lòng thử lại!'
    });
  }
};
