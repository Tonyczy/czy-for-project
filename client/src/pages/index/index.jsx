import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import './index.scss'
import { PAYLIST_CLASS_OUT } from '../constant'
import Modal from '../../components/modal'

export default class Index extends Component {

  // eslint-disable-next-line react/sort-comp
  config = {
    navigationBarTitleText: '首页'
  }

  state = {
    amount: 0,
  }

  modalPayIn = null
  modalPayOut = null

  onClassPayListClick = () => {
    Taro.navigateTo({ url: `/pages/paylist/index?type=${PAYLIST_CLASS_OUT}` })
  }

  componentWillMount () { }

  componentDidMount () {}

  componentWillUnmount () { }

  componentDidShow () {
    // 为之后需要增加 tabbar 状态保留
    if (typeof this.$scope.getTabBar === 'function' && this.$scope.getTabBar()) {
      this.$scope.getTabBar().setData({
        selected: 0,
      })
    }
  }

  componentDidHide () { }

  onPayInClick = () => {
    this.modalPayIn.show()
  }

  onPayOutClick = () => {
    this.modalPayOut.show()
  }

  render () {
    const { amount } = this.state

    return (
      <View className='index'>
        <View className='databoard'>
          <View className='databoard_title'>总金额</View>
          <View className='databoard_amount'>{ amount.toFixed(2) }</View>
          <View className='databoard_payclass-list'>
            <Text onClick={this.onClassPayListClick} className='databoard_payclass-list_text'>班级支出历史</Text>
          </View>
        </View>
        <View className='pay' onClick={this.onPayInClick}>缴纳</View>
        <View className='pay' onClick={this.onPayOutClick}>支出</View>
        <Modal ref={r => this.modalPayIn = r}>
          <Input className='payinput' placeholderStyle='color: #a0a0a0' placeholder='请输入缴纳金额' />
        </Modal>
        <Modal ref={r => this.modalPayOut = r}>
          <Input type='text' className='payinput' placeholderStyle='color: #a0a0a0' placeholder='请输入支出金额' />
          <Input type='text' className='payinput' placeholderStyle='color: #a0a0a0' placeholder='请输入支出事项' />
        </Modal>
      </View>
    )
  }
}
