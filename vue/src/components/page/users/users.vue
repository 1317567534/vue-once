<template>
  <el-card>
    <bread firstnav="用户管理" lastnav="用户列表"/>
    <!-- 搜索 -->
    <el-row class="myrow">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
        </el-input>
      </el-col>
      <el-col :span="16">&nbsp;&nbsp;
        <el-button type="success" plain @click="addUsers=true">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-table :data="dataList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch @change="statuChange(scope.row.id, scope.row.mg_state)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="200">
        <template slot-scope="scope">
          <div>
            <el-button @click="openEidt(scope.row.id)" size="mini" plain type="primary" icon="el-icon-edit"></el-button>
            <el-button @click="del(scope.row.id)" size="mini" plain type="danger" icon="el-icon-delete"></el-button>
            <el-button @click="fpjs(scope.row.id)" size="mini" plain type="success" icon="el-icon-check"></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :current-page="1"
      :page-sizes="[5, 10]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="mtable"
      @current-change="currentchange"
      @size-change="sizechange"
    ></el-pagination>

    <el-dialog title="添加用户" :visible.sync="addUsers">
      <el-form :model="addObj">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="addObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input type="password" v-model="addObj.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="addObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="addObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addqx">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户 -->
    <el-dialog title="修改用户" :visible.sync="editUsers">
      <el-form :model="editObj">
        <el-form-item label="用户名" label-width="100px">
          <el-input :disabled="true" v-model="editObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="editObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="editObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUsers=false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="roleDialog">
      <el-form :model="roleObj">
        <el-form-item label="用户名" label-width="100px">
          <label>{{ roleObj.username }}</label>
        </el-form-item>
        <el-form-item label="分配角色" label-width="100px">
          <el-select v-model="roleObj.rid" placeholder="请选择">
            <el-option  :disabled="true" label="请选择角色" :value="-1"></el-option>
            <el-option v-for="item in dropData" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="roleDialog = false">取 消</el-button>
      <el-button type="primary" @click="role">确 定</el-button>
    </div>
  </el-dialog>
  </el-card>
</template>

<script>
export default {
    data() {
        return {
            search: '',
            dataList: [],
            pagenum: 1,
            pagesize: 5,
            total: 0,
            addObj: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            dropData: [],
            editObj: {},
            roleObj: {},
            addUsers: false,
            editUsers: false,
            roleDialog: false
        }
    },
    methods: {
        async getAllList() {
            var res = await this.$http.get(`/users?query=${this.search}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
            var { meta, data } = res.data
            if(meta.status === 200) {
                this.dataList = data.users
                this.total = data.total
            }
        },
        searchData() {
            this.getAllList()
        },
        sizechange (size) {
            this.pagesize = size
            this.getAllList()
            // alert(1)
        },
        currentchange (num) {
            this.pagenum = num
            this.getAllList()
            // alert(2)
        },
        // 添加用户
        async add() {
            var res = await this.$http.request({
                url: '/users',
                method: 'post',
                data: {
                    username: this.addObj.username,
                    password: this.addObj.password,
                    email: this.addObj.email,
                    mobile: this.addObj.mobile
                }
            })
            var { meta } = res.data
            if(meta.status === 201) {
                this.$message({
                    message: meta.msg,
                    type: 'success'
                })
                this.getAllList()
            } else {
                this.$message.error(meta.msg)
            }
            this.addUsers = false
            this.addClean(this.addObj)
        },
        // 清除内容
        addClean(obj) {
            for(var item in obj) {
                obj[item] = ''
            }
        },
        // 取消按钮
        addqx() {
            this.addUsers = false
            this.addClean(this.addObj)
        },
        // 删除用户
        async del(id) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                var res = await this.$http.request({
                    url: `users/${id}`,
                    method: 'delete'
                })
                var { meta } = res.data
                if(meta.status === 200) {
                    this.$message({
                        message: meta.msg,
                        type: 'success'
                    })
                    this.getAllList()
                } else {
                    this.$message.error(meta.msg)
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        // 打开修改用户页面
        async openEidt(id) {
            this.editUsers = true
            var res = await this.$http.request({
                url: `/users/${id}`,
                method: 'get'
            })
            var { meta, data } = res.data
            if(meta.status === 200) {
                this.editObj = data
            } else {
                this.$message.error(meta.msg)
            }
        },
        // 点击提交修改数据
        async edit() {
            var res = await this.$http.request({
                url: `users/${this.editObj.id}`,
                method: 'put',
                data: {
                    email: this.editObj.email,
                    mobile: this.editObj.mobile
                }
            })
            var { meta } = res.data
            if(meta.status === 200) {
                this.$message({
                    message: meta.msg,
                    type: 'success'
                })
                this.getAllList()
            } else {
                this.$message.error(meta.msg)
            }
            this.editUsers = false
        },
        // 修改用户状态
        async statuChange(id, type) {
            var res = await this.$http.request({
                url: `users/${id}/state/${type}`,
                method: 'put'
            })
            var { meta } = res.data
            if(meta.status === 200) {
                this.$message({
                    message: meta.msg,
                    type: 'success'
                })
            } else {
                this.$message.error(meta.msg)
            }
        },
        // 打开分配面板
        async fpjs(id) {
            this.roleDialog = true
            this.getDown()
            var res = await this.$http.request({
                url:`users/${id}`,
                method: 'get'
            })
            var { meta, data } = res.data
            if(meta.status === 200) {
                this.roleObj = data
            } else {
                this.$message.error(meta.msg)
            }
        },
        // 获取下拉选项
        async getDown() {
            var res = await this.$http.request({
                url: 'roles',
                method: 'get'
            })
            var { meta, data } = res.data
            if(meta.status === 200) {
                this.dropData = data
            } else {
                this.$message.error(meta.msg)
            }
        },
        // 提交用户角色
        async role() {
            var rid = this.roleObj.rid
            var res = await this.$http.request({
                url: `users/${this.roleObj.id}/role`,
                method: 'put',
                data: {
                    rid : rid
                }
            })
            var { meta } = res.data
            if(meta.status === 200) {
                this.$message({
                    message: meta.msg,
                    type: 'success'
                })
            } else {
                this.$message.error(meta.msg)
            }
            this.roleDialog = false
        }
    },
    mounted() {
        this.getAllList()
    }
}
</script>

<style>
.myrow {
  margin: 15px;
}
.mtable {
    margin-top: 15px;
}
</style>
