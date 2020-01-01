import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
import { PAYLIST_CLASS_OUT } from '../constant'
import Modal from '../../components/modal'
import { getOpenid, updateUserInfo } from '../../actions/userinfo'

@connect(({ userinfo }) => ({ userinfo }), (dispatch) => ({
  dispatchGetOpenid () {
    dispatch(getOpenid())
  },
  dispatchUpdateUserInfo (info) {
    dispatch(updateUserInfo(info))
  }
}))
class Index extends Component {

  // eslint-disable-next-line react/sort-comp
  config = {
    navigationBarTitleText: '首页'
  }

  state = {
    personalPayInputValue: 0,
    classPayInputValue: 0,
    classPayTitle: ''
  }

  modalPayIn = null
  modalPayOut = null

  onClassPayListClick = () => {
    Taro.navigateTo({ url: `/pages/paylist/index?type=${PAYLIST_CLASS_OUT}` })
  }

  componentDidMount () {
    this.props.dispatchGetOpenid()
  }

  componentDidShow () {
    // 为之后需要增加 tabbar 状态保留
    if (typeof this.$scope.getTabBar === 'function' && this.$scope.getTabBar()) {
      this.$scope.getTabBar().setData({
        selected: 0,
      })
    }
  }

  onPayInClick = () => {
    this.modalPayIn.show()
  }

  onPayOutClick = () => {
    if (!this.props.userinfo.admin) {
      Taro.showToast({ title: '支出操作需要权限', icon: 'none' })
      return
    }

    this.modalPayOut.show()
  }

  onPersonalPayOK = async () => {
    const { personalPayInputValue } = this.state
    if (personalPayInputValue <= 0) {
      Taro.showToast({ title: '请输入大于0的数', icon: 'none' })
      return
    }

    Taro.showToast({ icon: 'loading', mask: true })
    const db = Taro.cloud.database()
    const personalPay = db.collection('personalPay')
    const data = {
      data: {
        value: personalPayInputValue,
        date: Date.now()
      }
    }
    await personalPay.add(data)
    const personalPayRes = await personalPay.limit(100).get()
    Taro.hideToast()
    this.modalPayIn.hide()
    const personalPayList = personalPayRes.data
    const personalPayListAmount = personalPayRes.data.reduce((a, c) => a + Number(c.value), 0)
    this.props.dispatchUpdateUserInfo({
      personalPay: personalPayList,
      personalPayAmount: personalPayListAmount
    })
  }

  onClassPayOK = async () => {
    const { classPayInputValue, classPayTitle } = this.state
    const { classid } = this.props.userinfo
    if (classPayInputValue <= 0 || classPayTitle == '') {
      Taro.showToast({ title: '请输入大于0的数以及完整的信息', icon: 'none' })
      return
    }

    Taro.showToast({ icon: 'loading', mask: true })
    const db = Taro.cloud.database()
    const classPay = db.collection('classPay')
    const data = {
      data: {
        title: classPayTitle,
        value: classPayInputValue,
        classid,
        date: Date.now()
      }
    }
    await classPay.add(data)

    // const classPayResCount = await classPay.where({ classid }).count()
    // const tasks = []
    // const MAX_LIMIT = 100
    // const classPayRequestTime = Math.ceil(classPayResCount.total / 100)
    // for (let i = 0; i < classPayRequestTime; i++) {
    //   const promise = classPay.where({ classid }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    //   tasks.push(promise)
    // }
    // const classPayRes = (await Promise.all(tasks)).reduce((acc, cur) => {
    //   return acc.concat(cur.data)
    // }, [])

    Taro.hideToast()
    this.modalPayOut.hide()
    // this.props.dispatchUpdateUserInfo({
    //   classPay: classPayRes,
    // })
  }

  render () {
    const { personalPayInputValue, classPayInputValue, classPayTitle } = this.state
    const { personalPayAmount } = this.props.userinfo

    return (
      <View className='index'>
        <View className='databoard'>
          <View className='databoard_title'>总金额</View>
          <View className='databoard_amount'>{ personalPayAmount.toFixed(2) }</View>
          <View className='databoard_payclass-list'>
            <Text onClick={this.onClassPayListClick} className='databoard_payclass-list_text'>班级支出历史</Text>
          </View>
        </View>
        <View className='pay' onClick={this.onPayInClick}>缴纳</View>
        <View className='pay' onClick={this.onPayOutClick}>支出</View>
        <Modal ref={r => this.modalPayIn = r} onOK={this.onPersonalPayOK}>
          <Input value={personalPayInputValue} onInput={(e) => {this.setState({personalPayInputValue: e.detail.value})}} type='digit' className='payinput' placeholderStyle='color: #a0a0a0' placeholder='请输入缴纳金额' />
        </Modal>
        <Modal ref={r => this.modalPayOut = r} onOK={this.onClassPayOK}>
          <Input value={classPayInputValue} onInput={(e) => {this.setState({classPayInputValue: e.detail.value})}} type='digit' className='payinput' placeholderStyle='color: #a0a0a0' placeholder='请输入支出金额' />
          <Input value={classPayTitle} onInput={(e) => {this.setState({classPayTitle: e.detail.value})}} type='text' className='payinput' placeholderStyle='color: #a0a0a0' placeholder='请输入支出事项' />
        </Modal>
      </View>
    )
  }
}

export default Index
