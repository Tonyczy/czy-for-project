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

@connect(({ userinfo }) => ({ userinfo }), () => ({}))
class PayList extends Component {

  // eslint-disable-next-line react/sort-comp
  config = {
    navigationBarTitleText: '历史'
  }

  state = {
    type: -1,
    list: []
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

  async componentDidMount () {
    const params = this.$router.params
    const type = params.type
    const { personalPay, openid, classid } = this.props.userinfo
    let classPay = []
    if ([PAYLIST_CLASS_OUT, PAYLIST_PERSONAL_OUT].includes(Number(type))) {
      Taro.showToast({ icon: 'loading', mask: true })
      const db = Taro.cloud.database()
      const classPayCollection = db.collection('classPay')

      const classPayResCount = await classPayCollection.where({ classid }).count()
      const tasks = []
      const MAX_LIMIT = 100
      const classPayRequestTime = Math.ceil(classPayResCount.total / 100)
      for (let i = 0; i < classPayRequestTime; i++) {
        const promise = classPayCollection.where({ classid }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
        tasks.push(promise)
      }
      classPay = (await Promise.all(tasks)).reduce((acc, cur) => {
        return acc.concat(cur.data)
      }, [])
      Taro.hideToast()
    }

    if (type) {
      this.setState({ type })
      let navigationBarTitle
      let payList
      switch (Number(type)) {
        case PAYLIST_CLASS_OUT:
          navigationBarTitle = '班级支出历史'
          payList = classPay
          break;
        case PAYLIST_PERSONAL_IN:
          navigationBarTitle = '个人缴纳历史'
          payList = personalPay
          break
        case PAYLIST_PERSONAL_OUT:
          navigationBarTitle = '个人支出历史'
          payList = classPay.filter(item => {
            return item._openid == openid
          })
          break
        default:
          navigationBarTitle = ''
          payList = []
          break;
      }
      Taro.setNavigationBarTitle({
        title: navigationBarTitle
      })
      this.setState({
        list: payList
      })
    }
  }

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

export default PayList
