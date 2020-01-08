/* eslint-disable no-restricted-globals */
import { call, all, takeLatest, put } from 'redux-saga/effects'
import { updateUserInfoSuccess } from 'redux/user/user.actions'
import TeacherTypes from './teacher.types'
import {
  getTeacherListSuccess,
  getTeacherListFailure,
  teacherGetInfoSuccess,
  teacherGetInfoToUpdateSuccess,
  teacherGetInfoFailure,
  teacherUpdateInfoSuccess,
  teacherUpdateInfoFailure,
  getStatisticalDataSuccess,
  getStatisticalDataFailure,
  searchTeacherFailure,
  searchTeacherSuccess,
} from './teacher.actions'
import TeacherService from '../../services/teacher.service'

// get all teacher info
function* getInfo({ payload: id }) {
  try {
    const teacher = yield TeacherService.getTeacherInfo(id)
    yield put(teacherGetInfoSuccess(teacher))
  } catch (err) {
    yield put(teacherGetInfoFailure(err.message))
  }
}
export function* getTeacherInfoSaga() {
  yield takeLatest(TeacherTypes.TEACHER_GET_INFO, getInfo)
}

// get teacher list
function* getList({ payload: filterConditions }) {
  try {
    const teacherList = yield TeacherService.getTeacherList(filterConditions)
    const numberOfTeachers = yield TeacherService.countTeachers(filterConditions)
    yield put(getTeacherListSuccess(teacherList, numberOfTeachers))
  } catch (err) {
    yield put(getTeacherListFailure(err.message))
  }
}
export function* getTeacherListSaga() {
  yield takeLatest(TeacherTypes.GET_TEACHER_LIST, getList)
}

// get statistical data
function* getStatisticalData({ payload: filterConditions }) {
  try {
    const data = yield TeacherService.getStatisticalData(filterConditions)
    yield put(getStatisticalDataSuccess(data))
  } catch (err) {
    yield put(getStatisticalDataFailure(err.message))
  }
}
export function* getStatisticalDataSaga() {
  yield takeLatest(TeacherTypes.TEACHER_GET_STATISTICS, getStatisticalData)
}

// === get teacher info to update
/**
 *
 * @param {String} payload: as id in User collection
 */
function* teacherGetInfoToUpdate({ payload }) {
  console.log('on teacher saga')
  try {
    const info = yield TeacherService.getInfoToUpdate(payload)
    yield put(teacherGetInfoToUpdateSuccess(info))
  } catch (err) {
    yield put(teacherGetInfoFailure(err.message))
  }
}
function* teacherGetInfoToUpdateSaga() {
  yield takeLatest(TeacherTypes.TEACHER_GET_INFO_TO_UPDATE, teacherGetInfoToUpdate)
}
// ===========
function* teacherUpdateInfo({ payload: { info, token } }) {
  try {
    yield TeacherService.updateInfo({ info, token })
    const { displayName, phone, birthdate, gender, city, district } = info
    yield put(
      updateUserInfoSuccess({
        displayName,
        phone,
        birthdate,
        gender,
        city,
        district,
      })
    )
    yield put(teacherUpdateInfoSuccess(info))
  } catch (err) {
    yield put(teacherUpdateInfoFailure(err.message))
  }
}
function* teacherUpdateInfoSaga() {
  yield takeLatest(TeacherTypes.TEACHER_UPDATE_INFO, teacherUpdateInfo)
}

function* getStatisticalDataHome(action) {
  try {
    const data = yield TeacherService.getStatisticalDataHome()
    action.getStatisticalDataHomeSuccess(data)
  } catch (err) {
    action.getStatisticalDataHomeFailure(err.message)
  }
}

function* getStatisticalDataHomeSaga() {
  yield takeLatest(TeacherTypes.TEACHER_GET_STATISTICS_HOME, getStatisticalDataHome)
}
// =================================
// ===========
/**
 *
 * @param {String} payload as keyword
 */
function* searchTeacher({ payload }) {
  try {
    console.log('teacher search saga: ', payload)
    const result = yield TeacherService.search(payload)
    yield put(searchTeacherSuccess(result))
  } catch (err) {
    yield put(searchTeacherFailure(err.message))
  }
}
function* searchTeacherSaga() {
  yield takeLatest(TeacherTypes.TEACHER_SEARCH, searchTeacher)
}

//= =======

export function* teacherSaga() {
  yield all([
    call(getTeacherInfoSaga),
    call(getTeacherListSaga),
    call(teacherUpdateInfoSaga),
    call(teacherGetInfoToUpdateSaga),
    call(getStatisticalDataSaga),
    call(getStatisticalDataHomeSaga),
    call(searchTeacherSaga),
  ])
}
