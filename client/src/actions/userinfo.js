import Taro from '@tarojs/taro'
import { UPDATE_USER_INFO } from '../constants/userinfo'

export const updateUserInfo = (info) => {
  return {
    type: UPDATE_USER_INFO,
    info
  }
}

export const getOpenid = () => {
  return async (dispatch) => {
    Taro.showToast({ icon: 'loading', mask: true })
    const res = await Taro.cloud.callFunction({
      name: "login",
      data: {}
    })
    Taro.hideToast()
    const openid = res.result.openid
    dispatch(updateUserInfo({ openid }))
    dispatch(getUserInfo(openid))
  }
}

export const getUserInfo = (openid) => {
  return async (dispatch) => {
    const db = Taro.cloud.database()
    const users = db.collection('users')
    const classes = db.collection('classes')
    Taro.showToast({ icon: 'loading', mask: true })
    const userRes = await users.where({ openid }).get()
    if (userRes.data == null || userRes.data.length == 0) {
      Taro.hideToast()
      Taro.showToast({ title: '请先完善您的信息', icon: 'none' })
      Taro.redirectTo({ url: '/pages/register/index' })
      return
    }
    const classRes = await classes.where({ classid: userRes.data[0].classid }).get()
    Taro.hideToast()
    dispatch(updateUserInfo({
      ...userRes.data[0],
      ...classRes.data[0],
      userid: userRes.data[0]._id
    }))
  }
}
