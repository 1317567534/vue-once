<template>
  <el-menu
    :router="true"
    :unique-opened="true"
    default-active="2"
    class="el-menu-vertical-demo mue"
  >
    <el-submenu v-for="item1 in sidebarList" :key="item1.id" :index="item1.path">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>{{ item1.authName }}</span>
      </template>
      <el-menu-item v-for="item2 in item1.children" :key="item2.id" :index="'/' + item2.path">
        <i class="el-icon-menu"></i>
        <span>{{ item2.authName }}</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
    data() {
        return {
            sidebarList: []
        }
    },
    methods: {
        async getAllList() {
            var res = await this. $http.request({
                url: '/menus',
                method: 'get'
            })
            var { meta, data } = res.data
            if(meta.status === 200) {
                this.sidebarList = data
            }
            else {
                this.$message.error(meta.msg)
            }
        }
    },
    mounted() {
        this.getAllList()
    }
}
</script>

<style>
.mue {
    height: 100%;
}
</style>
