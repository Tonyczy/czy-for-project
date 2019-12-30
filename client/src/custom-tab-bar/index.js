Component({
  data: {
    selected: 0,
    color: "#fff",
    selectedColor: "#fff",
    list: [{
      pagePath: "/pages/index/index",
      text: "首页"
    }, {
      pagePath: "/pages/my/index",
      text: "我的"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})
