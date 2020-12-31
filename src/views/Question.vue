<template>
    <div>
        <el-container>
            <el-header class="indexHeader" height="50px">
                <div style="display: flex; align-items: baseline">
                    <router-link to="/index" style="text-decoration: none">
                        <div class="title">问答社区</div>
                    </router-link>
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
                               size="normal" @click="goPublish">发布</el-button>
                    <el-dropdown class="userInfo" @command="commandHandler" trigger="click" style="cursor: pointer">
                        <span class="el-dropdown-link">
                        {{user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
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
                    <span style="margin-left: 25px">{{question.description}}</span>
                    <el-divider></el-divider>
                    <router-link to="/publish" v-if="question.userId===user.id">
                        <el-button icon="el-icon-edit-outline" type="text"
                                   style="color: #000000;width: auto;height: auto;margin-left: 25px;font-family: 黑体,serif ;color: gray;"
                                   size="normal" @click="goEdit">编辑</el-button></router-link>
                </el-main>
                <el-aside width="300px" class="indexAside">
                    <div>
                    <div style="margin-top: 10px;margin-bottom: 5px">发起人</div>
                    <div style=" display: flex;align-items: flex-start">
                        <el-avatar size="large" shape="square" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-avatar>
                        <div style="margin-left: 10px">
                            <span style="font-family: 黑体,serif;font-size:15px ">{{ user.name }}</span> <br>
                        </div>
                    </div>
                    </div>
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
            question:JSON.parse(window.sessionStorage.getItem("question")),
            user:JSON.parse(window.sessionStorage.getItem("user")),
            canEdit:false,
        }
    },
    mounted() {
        if (this.question.userId===this.user.id){
            this.canEdit=true;
        }
    },
    beforeRouteLeave(to, from, next){
        if (this.canEdit===false && window.sessionStorage.getItem("question")){
            window.sessionStorage.removeItem("question")
        }
        next()
    },
    methods:{
        goPublish(){
            window.sessionStorage.removeItem("question")
            this.$router.replace("/publish")
        },
        commandHandler(cmd) {
            if (cmd === 'logout') {
                this.$confirm('此操作将注销登录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    window.sessionStorage.removeItem("user")
                    this.$router.replace("/");
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            }
        }
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