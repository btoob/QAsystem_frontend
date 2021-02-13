<template>
<div class="header">

            <div style="display: flex; align-items: baseline">
<!--                <router-link to="/index" style="text-decoration: none">-->
                <el-link @click="goIndex" :underline="false"><div class="title">问答社区</div></el-link>
<!--                </router-link>-->
                <div style="display: flex; align-items: baseline;
                    vertical-align: mathematical;">
                    <el-input v-model="inputSearch" placeholder="可以直接回车搜索..." size="medium" @keydown.enter.native="carryInput"
                              clearable
                              @clear="carryInput"
                              style="margin-right: 8px;width: 200px"></el-input>
                    <el-button size="medium" type="info" icon="el-icon-search" style="width: auto;height: auto" @click="carryInput">搜索</el-button>
                </div>
            </div>
            <div>
                <el-link @click="goPublish" :underline="false" >
                    <el-button icon="el-icon-edit" type="text"
                               style="color: #000000;width: auto;height: auto;margin-right: 25px;margin-bottom: 2px"
                               size="normal">发布</el-button></el-link>
                <router-link to="/profile" v-if="user!==null">
                    <el-button type="text"
                               style="color: #000000;width: auto;height: auto;margin-right: 25px"
                               size="normal" @click="goNotification">通知
                        <span class="noticeNum">{{notificationNum}}</span>
                    </el-button></router-link>
                <el-dropdown v-if="user!==null" class="userInfo" @command="commandHandler" trigger="click" style="cursor: pointer;vertical-align:baseline">
                        <span class="el-dropdown-link">
                        {{ user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                            <el-image referrerPolicy="no-referrer" class="imgCircle"
                                      style="width: 30px; height: 30px;top:8px"
                                      :src="user.userFace"
                                      :fit="fit"></el-image>
                        </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                        <el-dropdown-item command="setting">设置</el-dropdown-item>
                        <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

            </div>
</div>

</template>

<script>
    import Index from "@/views/Index";
    import func from "@/utils/func";
    export default {
        name: "Header",
        data(){
            return{
                sectionName:'我的问题',
                notificationNum:0,
                user:JSON.parse(window.sessionStorage.getItem("user")),
                inputSearch:'',
            }
        },
        methods:{
            goPublish(){
                window.sessionStorage.removeItem("question");
                this.$router.replace("/publish");
            },
            goIndex(){
                this.$router.replace("/")
            },
            carryInput(){
                // window.sessionStorage.setItem("searchInput", this.inputSearch);
                //调用index页面的方法
                func.$emit("demo", this.inputSearch);
            },
            initNotificationNum(){
                this.getRequest("notification/notificationNum/"+this.user.id).then(resp=>{
                    if (resp){
                        this.notificationNum=resp.object;
                    }
                })
            },
            goNotification(){
                this.sectionName='最新回复';
            },
            commandHandler(cmd) {
                if (cmd === 'logout') {
                    this.$confirm('此操作将注销登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        window.sessionStorage.removeItem("user");
                        window.sessionStorage.removeItem("question");
                        this.$router.replace("/login");
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
                }else if(cmd === 'userinfo'){
                    this.$router.replace("/profile")
                }
            }
        },
    }
</script>

<style>
.header {
    background-color: white;
    margin-bottom: 25px;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    width: 100%;
    height: 100%;
}
.header .title {
    font-size: 20px;
    font-family: 黑体,serif ;
    color: gray;
    margin-right: 20px;
}
</style>