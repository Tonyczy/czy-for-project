import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
import {
  PAYLIST_PERSONAL_IN,
  PAYLIST_PERSONAL_OUT,
  PAYLIST_CLASS_OUT
} from '../constant'
import { formatDate } from '../utils'
import { updateUserInfo } from '../../actions/userinfo'

export default class PayList extends Component {

  // eslint-disable-next-line react/sort-comp
  config = {
    navigationBarTitleText: '历史'
  }

  state = {
    type: -1,
    list: [
      {
        id: 0,
        title: '购买xx',
        value: 100,
        date: 1577694296051
      },
      {
        id: 1,
        title: '购买xx',
        value: 100,
        date: 1577694296051
      },
      {
        id: 2,
        title: '购买xx',
        value: 100,
        date: 1577694296051
      }
    ]
  }

  async getPayList(type) {
    const a = type
  }

  renderList = () => {
    const { list } = this.state

    const lists = list.map(item => {
      return <View className='listitem' key={item.id}>
        <View className='listitem_left'>
          <Text className='listitem_left_title'>{item.title}</Text>
          <Text className='listitem_left_value'>{item.value}</Text>
        </View>
        <View className='listitem_right'>{formatDate(item.date)}</View>
      </View>
    })
    return lists
  }

  componentWillMount () { }

  async componentDidMount () {
    const params = this.$router.params
    const type = params.type
    if (type) {
      this.setState({ type })
      let navigationBarTitle
      switch (Number(type)) {
        case PAYLIST_CLASS_OUT:
          navigationBarTitle = '班级支出历史'
          break;
        case PAYLIST_PERSONAL_IN:
          navigationBarTitle = '个人缴纳历史'
          break
        case PAYLIST_PERSONAL_OUT:
          navigationBarTitle = '个人支出历史'
          break
        default:
          navigationBarTitle = ''
          break;
      }
      Taro.setNavigationBarTitle({
        title: navigationBarTitle
      })
    }
    await this.getPayList(type)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { list, type } = this.state

    return (
      <View className='paylist'>
        <View className='header'>{ type == PAYLIST_PERSONAL_IN ? '已缴纳' : '已支出' }{list.length}笔金额</View>
        { this.renderList() }
      </View>
    )
  }
}
