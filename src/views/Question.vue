<template>
    <div>
        <el-container>
            <el-header class="indexHeader" height="50px">
                <div style="display: flex; align-items: baseline">
                    <div class="title">问答社区</div>
                    <div style="display: flex; align-items: baseline;
                    vertical-align: mathematical;">
                        <el-input v-model="input" placeholder="" size="medium"
                                  style="margin-right: 8px;width: 200px"></el-input>
                        <el-button size="medium" type="info" icon="el-icon-search" style="width: auto;height: auto">搜索</el-button>
                    </div>
                </div>
                <div>
                    <el-button icon="el-icon-edit" type="text"
                               style="color: #000000;width: auto;height: auto;margin-right: 25px"
                               size="normal" @click="goChat">提问</el-button>
                    <el-dropdown class="userInfo" @command="commandHandler" trigger="click" style="cursor: pointer">
                        <span class="el-dropdown-link">
                        用户名<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                            <el-dropdown-item command="setting">设置</el-dropdown-item>
                            <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>

            </el-header>
            <el-container>
                <el-main class="indexMain">
                    <div style="margin-left: 10px">
                        <i class="el-icon-files" style="margin-bottom: 15px" >   {{question.title}}</i> <br>
                        <span class="text_desc">
                                    <span>{{question.commentCount}}</span> 个回复 · <span>{{question.viewCount}}</span> 次浏览 · <span>{{question.updateTime}}</span>
                                </span>
                    </div>
                    <el-divider></el-divider>
                    <span>{{question.description}}</span>
                </el-main>
                <el-aside width="300px" class="indexAside">
                    <h3>热门标签</h3>
                </el-aside>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    name: "Question",
    data(){
        return{
            question:JSON.parse(window.sessionStorage.getItem("question"))
        }
    },
    mounted() {

    },
    methods:{

    }
}
</script>

<style>
.indexAside{
    margin-left: 20px;
    background-color: white;
    box-sizing: border-box;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
}

.indexMain{
    background-color: white;
    margin-left: 25px;
    box-sizing: border-box;
}
.indexHeader {
    background-color: white;
    margin-top: 1px;
    margin-bottom: 25px;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    box-sizing: border-box;
    box-shadow: 0 0 25px #cac6c6;
}
.indexHeader .title {
    font-size: 20px;
    font-family: 黑体,serif ;
    color: gray;
    margin-right: 20px;
}
.el-icon-files{
    font-size: 25px;
    font-family: 黑体,serif ;
    color: gray;
    border-bottom: #1b6d85;
}
.text_desc{
    font-size: 10px;
    font-family: 黑体,serif ;
    color: gray;
}

</style>
<style scoped>
.el-divider--horizontal {
    display: block;
    height: 1px;
    width: 80%;
    margin: 12px 0;
}
</style>