import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

export default class Modal extends Component {

  state = {
    show: false
  }

  componentDidMount () {}

  show = () => {
    this.setState({ show: true })
  }

  hide = () => {
    this.setState({ show: false })
  }

  onCancelClick = () => {
    this.hide()
    if (this.props.onCancel) {
      this.props.onCancel()
    }
  }

  onOKClick = () => {
    // this.hide()
    if (this.props.onOK) {
      this.props.onOK()
    }
  }

  render () {
    const { show } = this.state
    const { notShowCancel } = this.props

    return (
      <View className='modal_wrapper'>
       { show && <View className='modal'>
          <View className='modal_content'>
            { this.props.children }
            <View className='actions'>
              { !notShowCancel && <View className='actions_cancel actions_item' onClick={this.onCancelClick}>取消</View> }
              <View className='actions_ok actions_item' onClick={this.onOKClick}>确认</View>
            </View>
          </View>
        </View>}
      </View>
    )
  }
}
