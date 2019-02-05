<template>
    <el-card>
        <mybread firstnav="商品管理" lastnav="商品列表" />
        <el-alert class="myalert" title="添加商品信息" type="info" center show-icon>
        </el-alert>
        <el-steps class="mysteps" :active="active" finish-status="success" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
        </el-steps>
        <el-tabs @tab-click="tabclick" tab-position="left">
            <el-tab-pane label="基本信息">
                <el-form label-position="top" :model="addObj" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="商品名称">
                        <el-input type="text" v-model="addObj.pass" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格">
                        <el-input type="text" v-model="addObj.checkPass" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量">
                        <el-input type="text" v-model="addObj.checkPass" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <el-input type="text" v-model="addObj.checkPass" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        {{ cateData }}
                        <el-cascader expand-trigger="hover" :props="props" :options="cateList" v-model="cateData">
                        </el-cascader>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="商品参数">
                <div v-for="item in manyParams" :key="item.attr_id">
                    <p>{{item.attr_name}}</p>
                    <div>
                        <el-checkbox v-for="(item1, index) in item.attr_vals.split(',')" :key="index" v-model="checked" :label="item1" border></el-checkbox>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="商品属性">
              <el-form label-position="top" label-width="80px">
                  <el-form-item :label="item.attr_name" v-for="item in onlyParams" :key="item.attr_id">
                      <el-input v-model="item.attr_vals"></el-input>
                  </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="商品图片">
              <el-upload :on-preview="uploadpreview" :on-remove="uploadremove" :on-success="uploadsuccess" :headers="headers" class="upload-demo" action="http://localhost:8888/api/private/v1/upload" list-type="picture">
                  <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容">
              <el-button @click="add">添加用户</el-button>
              <!-- 富文本编辑框 -->
              <!-- <quill-editor v-model="goods_introduce"></quill-editor> -->
            </el-tab-pane>
        </el-tabs>
        <el-dialog title="图片预览" :visible.sync="previewDialog">
            <img style="width: 100%" ref="myimg" src="#" alt="">
        </el-dialog>
    </el-card>
</template>

<script>
export default {
  data () {
    return {
      addObj: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: ''
      },
      active: 0,
      checked: true,
      cateData: [],
      props: {
        value: 'cat_id',
        label: 'cat_name'
      },
      cateList: [],
      manyParams: [],
      onlyParams: [],
      headers: {
          'Authorization': window.localStorage.getItem('token')
      },
      previewDialog: false
    }
  },
  methods: {
    async add() {
      this.addObj.goods_cat = this.cateData.join(',')
      var res = await this.$http.post('/goods', this.addObj)
      console.log(res)
      var { mate } = res.data
      if(meta.status === 201) {
        this.$message({
            message: meta.msg,
            type: 'success'
        })
        this.$router.push('/goods')
      }
      else {
          this.$message.error(meta.msg)
      }
    },
    uploadpreview(file) {
      this.previewDialog = true
      this.$nextTick(() => {
          this.$refs.myimg.src = file.response.data.url
      })
    },
    uploadremove(file, filelist) {
      for (var i = 0; i < this.addObj.pics.length; i++) {
          if (this.addObj.pics[i] === file.response.data.tmp_path) {
              this.addObj.pics.splice(i, 1)
              break
          }
      }
    },
    uploadsuccess(response, file, fileList) {
      if (response.meta.status === 200) {
          this.$message({
              message: '上传成功',
              type: 'success'
          })
          // 将图片保存到 fileList
          this.addObj.pics.push(response.data.tmp_path)
      } else {
          this.$message.error(response.meta.msg)
      }
    },
    tabclick (e) {
      this.active = Number(e.index)
      if (e.index === '1') {
        this.getParams('many')
      }
      if(e.index === '2') {
        this.getParams('only')
      }
    },
    async getAllCate () {
      var res = await this.$http.get(`/categories?type=3`)
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.cateList = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 得到参数
    async getParams (sel) {
      if (this.cateData.length === 0) {
        this.$message.error('请选择商品分类')
        return
      }
      var id = this.cateData[this.cateData.length - 1]
      var res = await this.$http.get(`/categories/${id}/attributes?sel=${sel}`)
      var { meta, data } = res.data
      if (meta.status === 200) {
        if(sel === 'many') {
          this.manyParams = data
        }else {
          this.onlyParams = data
        }
      } else {
        this.$message.error(meta.msg)
      }
    }
  },
  mounted () {
    this.getAllCate()
  }
}
</script>

<style>
.myalert {
  margin: 15px 0;
}

.el-step__title {
    font-size: 12px;
}

div#pane-4 {
    height: 400px;
}

.quill-editor {
    height: 300px;
}
</style>
