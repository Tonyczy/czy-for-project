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
    Taro.showToast({ icon: 'loading', mask: true })
    const userRes = await users.where({ openid }).get()
    if (userRes.data == null || userRes.data.length == 0) {
      Taro.hideToast()
      Taro.showToast({ title: '请先完善您的信息', icon: 'none' })
      Taro.redirectTo({ url: '/pages/register/index' })
      return
    }
    const classes = db.collection('classes')
    const personalPayCollection = db.collection('personalPay')
    const classRes = await classes.where({ classid: userRes.data[0].classid }).get()
    const personalPayResCount = await personalPayCollection.where({ _openid: openid }).count()
    const tasks = []
    const MAX_LIMIT = 100
    const personalPayRequestTime = Math.ceil(personalPayResCount.total / 100)
    for (let i = 0; i < personalPayRequestTime; i++) {
      const promise = personalPayCollection.where({ _openid: openid }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      tasks.push(promise)
    }
    const personalPay = (await Promise.all(tasks)).reduce((acc, cur) => {
      return acc.concat(cur.data)
    }, [])
    const personalPayAmount = personalPay.reduce((a, c) => a + Number(c.value), 0)
    Taro.hideToast()
    dispatch(updateUserInfo({
      ...userRes.data[0],
      ...classRes.data[0],
      userid: userRes.data[0]._id,
      personalPay,
      personalPayAmount
    }))
  }
}
