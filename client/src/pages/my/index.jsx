import Taro, { Component } from '@tarojs/taro'
import { View, OpenData, Image, Text, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
import Modal from '../../components/modal'
import {
  PAYLIST_PERSONAL_IN,
  PAYLIST_PERSONAL_OUT
} from '../constant'
import { updateUserInfo } from '../../actions/userinfo'

import imgPayIn from '../../assets/img/payin.png'
import imgPayOut from '../../assets/img/payout.png'

@connect(({ userinfo }) => ({ userinfo }), (dispatch) => ({
  dispatchUpdateUserInfo (info) {
    dispatch(updateUserInfo(info))
  }
}))
class My extends Component {

  // eslint-disable-next-line react/sort-comp
  config = {
    navigationBarTitleText: '我的'
  }

  state = {
    permissionCode: ''
  }

  modalPermission = null

  componentDidMount () {

  }

  componentDidShow () {
    if (typeof this.$scope.getTabBar === 'function' && this.$scope.getTabBar()) {
      this.$scope.getTabBar().setData({
        selected: 1,
      })
    }
  }

  onPermissionClick = () => {
    this.modalPermission.show()
  }

  onPayInListClick = () => {
    Taro.navigateTo({ url: `/pages/paylist/index?type=${PAYLIST_PERSONAL_IN}` })
  }

  onPayOutListClick = () => {
    Taro.navigateTo({ url: `/pages/paylist/index?type=${PAYLIST_PERSONAL_OUT}` })
  }

  updatePermission = async () => {
    const {userinfo, dispatchUpdateUserInfo} = this.props
    if (userinfo.admin) {
      Taro.showToast({ title: '您已经拥有权限', icon: 'none' })
      return
    }

    Taro.showToast({ icon: 'loading', mask: true })
    const db = Taro.cloud.database()
    const { permissionCode } = this.state
    const permissionCodeCollection = db.collection('permissionCode')
    const pCodeRes = await permissionCodeCollection.where({ code: permissionCode }).get()
    if (pCodeRes.data.length == 0) {
      Taro.hideToast()
      Taro.showToast({ title: '邀请码不正确', icon: 'none' })
      return
    }
    const users = db.collection('users')
    await users.doc(userinfo.userid).update({
      data: {
        admin: true
      }
    })
    await permissionCodeCollection.doc(pCodeRes.data[0]._id).remove()
    dispatchUpdateUserInfo({ admin: true })
    this.modalPermission.hide()
    Taro.showToast({ title: '您现在拥有权限了', icon: 'none' })
  }

  render () {
    const { userinfo } = this.props
    const { permissionCode } = this.state

    return (
      <View className='my'>
        <View className='avatar'><OpenData type='userAvatarUrl'></OpenData></View>
        <View className='databoard'>
          <View className='databoard_item'>用户名: {userinfo.name}</View>
          <View className='databoard_item'>学号: {userinfo.stuno}</View>
          <View className='databoard_item'>班级: {userinfo.classname}</View>
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
        <Modal ref={r => this.modalPermission = r} onOK={this.updatePermission}>
          <View className='permission_text'>权限设置</View>
          <Input value={permissionCode} onInput={(e) => { this.setState({ permissionCode: e.detail.value }) }} className='permissioninput' placeholderStyle='color: #a0a0a0' placeholder='请输入邀请码' />
        </Modal>
      </View>
    )
  }
}
export default My
