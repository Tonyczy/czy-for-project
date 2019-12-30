import Taro, { Component } from '@tarojs/taro'
import { View, OpenData, Image, Text, Input } from '@tarojs/components'
import './index.scss'
import Modal from '../../components/modal'
import {
  PAYLIST_PERSONAL_IN,
  PAYLIST_PERSONAL_OUT
} from '../constant'

import imgPayIn from '../../assets/img/payin.png'
import imgPayOut from '../../assets/img/payout.png'

export default class My extends Component {

  // eslint-disable-next-line react/sort-comp
  config = {
    navigationBarTitleText: '我的'
  }

  state = {
    userInfo: {
      name: '沙发边开发',
      stuno: '1212414214',
      classname: '算法加把劲开发'
    }
  }

  modalPermission = null

  componentWillMount () { }

  componentDidMount () {

  }

  componentWillUnmount () { }

  componentDidShow () {
    if (typeof this.$scope.getTabBar === 'function' && this.$scope.getTabBar()) {
      this.$scope.getTabBar().setData({
        selected: 1,
      })
    }
  }

  componentDidHide () { }

  onPermissionClick = () => {
    this.modalPermission.show()
  }

  onPayInListClick = () => {
    Taro.navigateTo({ url: `/pages/paylist/index?type=${PAYLIST_PERSONAL_IN}` })
  }

  onPayOutListClick = () => {
    Taro.navigateTo({ url: `/pages/paylist/index?type=${PAYLIST_PERSONAL_OUT}` })
  }

  render () {
    const { userInfo } = this.state

    return (
      <View className='my'>
        <View className='avatar'><OpenData type='userAvatarUrl'></OpenData></View>
        <View className='databoard'>
          <View className='databoard_item'>用户名: {userInfo.name}</View>
          <View className='databoard_item'>学号: {userInfo.stuno}</View>
          <View className='databoard_item'>班级: {userInfo.classname}</View>
        </View>
        <View className='actions'>
          <View className='actions_item' onClick={this.onPayInListClick}>
            <Image src={imgPayIn} className='actions_item_icon' />
            <Text className='actions_item_text'>缴纳</Text>
          </View>
          <View className='actions_item' onClick={this.onPayOutListClick}>
            <Image src={imgPayOut} className='actions_item_icon' />
            <Text className='actions_item_text'>支出</Text>
          </View>
        </View>
        <View className='actions'>
          <View className='actions_item' onClick={this.onPermissionClick}>
            <Text className='actions_item_text'>我的权限</Text>
          </View>
        </View>
        <Modal ref={r => this.modalPermission = r}>
          <View className='permission_text'>权限设置</View>
          <Input className='permissioninput' placeholderStyle='color: #a0a0a0' placeholder='请输入邀请码' />
        </Modal>
      </View>
    )
  }
}
