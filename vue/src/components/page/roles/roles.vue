<template>
  <el-card>
    <mybread firstnav="权限管理" lastnav="角色列表"/>
    <el-row class="myrow">
      <el-col :span="24">
        <el-button plain @click="addRoles=true">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-table :data="rolesList" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="item1 in scope.row.children" :key="item1.id">
            <el-col :span="5">
              <el-tag
                @close="delRight(scope.row.id, item1.id, scope.row)"
                closable
              >{{item1.authName}}-{{item1.id}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="19">
              <!-- 遍历生成二级权限 -->
              <el-row v-for="item2 in item1.children" :key="item2.id">
                <el-col :span="6">
                  <el-tag
                    @close="delRight(scope.row.id, item2.id, scope.row)"
                    type="success"
                    closable
                  >{{item2.authName}}-{{item2.id}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="18">
                  <!-- 遍历生成三级权限 -->
                  <el-tag
                    @close="delRight(scope.row.id, item3.id, scope.row)"
                    type="warning"
                    closable
                    v-for="item3 in item2.children"
                    :key="item3.id"
                  >{{item3.authName}}-{{item3.id}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <span v-if="scope.row.children.length === 0">没有分配权限</span>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button  @click="editRoles(scope.row.id)" size="mini" plain type="primary" icon="el-icon-edit"></el-button>
          <el-button
            @click="del(scope.row.id)"
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
          ></el-button>
          <el-button
            @click="openRole(scope.row.children, scope.row.id)"
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限面板 -->
    <el-dialog title="分配权限" :visible.sync="roleDialog">
      <!--
                    el-tree: 树形结构
                        data：数据源
                        show-checkbox：显示多选框
                        props：当前树状结构绑定数据的配置项
                            label: 设置树状结构显示的文本
                            children: 设置树状结构的子选项
                        node-key：给当前选项设置一个唯一标识
                        default-expanded-keys：
                        default-checked-keys：
      -->
      <el-tree
        ref="mytree"
        :data="rightsList"
        show-checkbox
        :default-checked-keys="defaultChecked"
        node-key="id"
        :props="props"
        :default-expand-all="true"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog title="添加用户" :visible.sync="addRoles">
      <el-form :model="rolesObj">
        <el-form-item label="角色名称" label-width="100px">
          <el-input v-model="rolesObj.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px">
          <el-input v-model="rolesObj.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoles = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog title="修改用户" :visible.sync="editR">
      <el-form :model="editObj">
        <el-form-item label="角色名称" label-width="100px">
          <el-input v-model="editObj.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px">
          <el-input v-model="editObj.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editR = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      rightsList: [],
      roleDialog: false,
      // 设置当前角色的Id
      roleId: '',
      props: {
        label: 'authName',
        children: 'children'
      },
      defaultChecked: [],
      addRoles: false,
      rolesObj: {
        roleName: '',
        roleDesc: ''
      },
      editR: false,
      editObj: {},
      editID: ''
    }
  },
  methods: {
    async getAllRoles () {
      var res = await this.$http.request({
        url: '/roles',
        method: 'get'
      })
      // console.log(res)
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.rolesList = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 删除角色的权限
    // 要删除权限的角色Id
    // 要删除的权限Id
    async delRight (roleId, rightId, rightData) {
      var res = await this.$http.request({
        url: `roles/${roleId}/rights/${rightId}`,
        method: 'delete'
      })
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
        // console.log(data)
        rightData.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 打开分配权限的面板
    openRole (rights, id) {
      this.defaultChecked = []
      this.roleId = id
      this.getAllrights()
      this.roleDialog = true
      // 得到当前角色的权限
      // 得到第三层元素的id
      rights.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            this.defaultChecked.push(item3.id)
          })
        })
      })
    },
    // 得到所有权限数据
    async getAllrights () {
      var res = await this.$http.request({
        url: 'rights/tree',
        method: 'get'
      })
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.rightsList = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 设置权限
    async setRights () {
      // console.log(this.roleId);
      var allcheck = this.$refs.mytree.getCheckedKeys()
      var halfcheck = this.$refs.mytree.getHalfCheckedKeys()
      var newArr = allcheck.concat(halfcheck)
      // 将所有选中的内容以‘ , ’分割成为字符串
      var rids = newArr.join(',')
      var res = await this.$http.request({
        url: `roles/${this.roleId}/rights`,
        method: 'post',
        data: {
          rids: rids
        }
      })
      var { meta } = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
      } else {
        this.$message.error(meta.msg)
      }
      this.roleDialog = false
      this.getAllRoles()
    },
    // 添加角色
    async add () {
      var res = await this.$http.request({
        url: '/roles',
        method: 'post',
        data: {
          roleName: this.rolesObj.roleName,
          roleDesc: this.rolesObj.roleDesc
        }
      })
      console.log(res)
      var { meta } = res.data
      if (meta.status === 201) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
        this.getAllRoles()
      } else {
        this.$message.error(meta.msg)
      }
      this.addRoles = false
    },
    // 删除角色
    del (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          var res = await this.$http.request({
            url: `/roles/${id}`,
            method: 'delete',
            headers: {
              'Authorization': window.localStorage.getItem('token')
            }
          })
          var { meta } = res.data
          if (meta.status === 200) {
            this.$message({
              message: meta.msg,
              type: 'success'
            })
            this.getAllRoles()
          } else {
            this.$message.error(meta.msg)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 打开编辑面板,获取数据
    async editRoles (id) {
      this.editR = true
      this.editID = id
      var res = await this.$http.request({
        url: `roles/${id}`,
        method: 'get',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        }
      })
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.editObj = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 修改后提交
    async edit () {
      var res = await this.$http.request({
        url: `roles/${this.editID}`,
        method: 'put',
        data: {
          roleName: this.editObj.roleName,
          roleDesc: this.editObj.roleDesc
        },
        headers: {
          'Authorization': window.localStorage.getItem('token')
        }
      })
      console.log(res)
      var { meta } = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
        this.getAllRoles()
      } else {
        this.$message.error(meta.msg)
      }
      this.editR = false
    }
  },
  mounted () {
    this.getAllRoles()
  }
}
</script>

<style>
.myrow {
  margin: 15px 0;
}
.el-tag {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
