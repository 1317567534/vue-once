export default {
  data () {
    return {
      search: '',
      goodsList: [],
      pagenum: 1,
      pagesize: 10,
      total: 0
    }
  },
  methods: {
    async getAllGoods () {
      var res = await this.$http.get(`/goods?query=${this.search}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.goodsList = data.goods
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },
    add () {
      this.$router.push('/goods/add')
    }
  },
  mounted () {
    this.getAllGoods()
  }
}
