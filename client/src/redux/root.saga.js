import { call, all } from 'redux-saga/effects'
import { userSaga } from './user/user.sagas'
import { teacherSaga } from './teacher/teacher.sagas'
import { studentSaga } from './student/student.sagas'
import { majorSaga } from './major/major.sagas'
import { locationSaga } from './location/location.sagas'
import { contractSaga } from './contract/contract.sagas'
import { chatSaga } from './chat/chat.sagas'
import { notificationSaga } from './notification/notification.sagas'

export default function* rootSagas() {
  yield all([
    call(userSaga),
    call(teacherSaga),
    call(studentSaga),
    call(majorSaga),
    call(locationSaga),
    call(contractSaga),
    call(chatSaga),
    call(notificationSaga),
  ])
}
