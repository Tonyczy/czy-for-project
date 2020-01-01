import Taro, { Component } from '@tarojs/taro'
import { View, Input, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
import Modal from '../../components/modal'

@connect(({ userinfo }) => ({ userinfo }), () => ({}))
class Register extends Component {

  // eslint-disable-next-line react/sort-comp
  config = {
    navigationBarTitleText: '完善信息'
  }

  state = {
    classList: [],
    classnameList: [],
    classSelectedIndex: 0,
    name: '',
    stuno: ''
  }

  modalReg = null

  async componentDidMount () {
    await this.getClasses()
    this.modalReg.show()
  }

  getClasses = async () => {
    Taro.showToast({ icon: 'loading', mask: true })
    const db = Taro.cloud.database()
    const classes = db.collection('classes')
    const classesRes = await classes.get()
    Taro.hideToast()
    const classnameList = classesRes.data.map(item => {
      return item.classname
    })
    this.setState({
      classList: classesRes.data,
      classnameList
    })
  }

  onClassPickerChange = (e) => {
    this.setState({
      classSelectedIndex: e.detail.value
    })
  }

  onModalOKClick = async () => {
    const { name, stuno, classList, classSelectedIndex } = this.state
    if (name.length == 0 || stuno.length == 0) {
      Taro.showToast({ title: '请填写完整信息后点击确认', icon: 'none' })
      return
    }

    Taro.showToast({ icon: 'loading', mask: true })
    const db = Taro.cloud.database()
    const users = db.collection('users')

    await users.add({
      data: {
        name,
        stuno,
        classid: classList[classSelectedIndex].classid,
        openid: this.props.userinfo.openid,
        admin: false
      }
    })
    Taro.hideToast()
    this.modalReg.hide()
    Taro.switchTab({ url: '/pages/index/index' })
  }

  render () {
    const { classSelectedIndex, classnameList, name, stuno } = this.state

    return (
      <View className='register'>
        <Modal ref={r => this.modalReg = r} notShowCancel onOK={this.onModalOKClick}>
          <Input value={name} onInput={(e) => { this.setState({name: e.detail.value}) }} type='text' className='rinput' placeholderStyle='color: #a0a0a0' placeholder='姓名' />
          <Input value={stuno} onInput={(e) => { this.setState({stuno: e.detail.value}) }} type='text' className='rinput' placeholderStyle='color: #a0a0a0' placeholder='学号' />
          <Picker range={classnameList} onChange={this.onClassPickerChange}>
            <View className='pickercontent'>班级: {classnameList[classSelectedIndex]}</View>
          </Picker>
        </Modal>
      </View>
    )
  }
}

export default Register
