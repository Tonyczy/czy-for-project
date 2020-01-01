import { UPDATE_USER_INFO } from '../constants/userinfo'

const INITIAL_STATE = {
  name: '',
  stuno: '',
  classname: '',
  classid: '',
  openid: '',
  userid: '',
  admin: false,
  personalPay: [],
  classPay: [],
  personalPayAmount: 0
}

export default function userinfo (state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_USER_INFO:
      return {
        ...state,
        ...action.info
      }
    default:
      return state
  }
}
