<template>
    <el-container>
        <el-header>
            <!-- 头部 -->
            <headers />
        </el-header>
        <el-container>
            <el-aside width="200px">
                <!-- 侧边栏 -->
                <sidebar />
            </el-aside>
            <el-main>
                <!-- 内容 -->
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import headers from '../layout/headers.vue'
import sidebar from '../layout/sidebar.vue'
export default {
    components: {
        headers,
        sidebar
    }
}
</script>

<style>
.el-container {
    height: 100%;
}
.el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
    padding: 0;
}

.el-aside {
    background-color: #D3DCE6;
    color: #333;
    height: 100%;
}

.el-main {
    background-color: #E9EEF3;
    color: #333;
    height: 100%;
}
</style>
