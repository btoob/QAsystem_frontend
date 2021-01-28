<template>
    <div>
        <el-container>
            <el-header class="indexHeader" height="50px">
                <Header></Header>
            </el-header>
            <el-container class="indexContainer">
                <el-main class="indexMain">
                    <i class="el-icon-files" style="margin-bottom: 15px" >  {{ title }}</i>
                    <el-divider></el-divider>

                    <el-row v-show="title==='我的问题'" v-for="(question, index) in personalQuestions" :key="index">
                        <div style=" display: flex;align-items: flex-start">
                            <el-image referrerPolicy="no-referrer" class="imgCircle"
                                      style="width: 40px; height: 40px"
                                      :src="question.user.userFace"
                                      :fit="fit"></el-image>
                            <div style="margin-left: 10px">
                                <el-link @click="goDetail(question)" type="primary">{{ question.title }}</el-link> <br>
                                <span class="text_desc">
                                    <span>{{question.commentCount}}</span> 个回复 · <span>{{question.viewCount}}</span> 次浏览 · <span>{{question.updateTime}}</span>
                                </span>
                            </div>
                        </div>
                        <el-divider style="margin-top: 3px"></el-divider>
                    </el-row>

                    <el-row v-show="title==='最新回复'" v-for="(reply, j) in replies" :key="j">
                        <div style=" display: flex;align-items: center;font-size: 13px">
                            <span style="margin-right: 10px">{{reply.notifierName}} </span>
                            回复了问题
                            <span style="margin-left: 10px">
                                <el-link @click="goDetailByQuestionId(reply)" type="primary"> {{reply.questionTitle}}</el-link>
                            </span>
                            <span v-show="reply.status===0" class="unRead">
                                未读
                            </span>
                        </div>
                        <el-divider style="margin-top: 3px"></el-divider>
                    </el-row>
                    <div class="page">
                        <el-pagination
                            class="msg-pagination-container"
                            background
                            :page-sizes="[5, 10, 15]"
                            :page-size="5"
                            @current-change="handleCurrentChange"
                            @size-change="handleSizeChange"
                            layout="sizes, prev, pager, next, jumper, ->, total, slot"
                            :total="total">
                        </el-pagination>
                    </div>

                </el-main>
                <el-aside width="300px" class="indexAside">
                    <el-menu
                        :default-active=defaultActive
                        class="el-menu-vertical-demo"
                        @open="handleOpen"
                        @close="handleClose">
                        <el-menu-item index="1" @click="initQuestions">
                            <i class="el-icon-menu"></i>
                            <span slot="title">我的问题</span>
                        </el-menu-item>
                        <el-menu-item index="2" @click="initReplies">
                            <i class="el-icon-menu"></i>
                            <span slot="title">最新回复</span>
                        </el-menu-item>
                        <el-menu-item index="3" disabled>
                            <i class="el-icon-document"></i>
                            <span slot="title">待定</span>
                        </el-menu-item>
                        <el-menu-item index="4">
                            <i class="el-icon-setting"></i>
                            <span slot="title">待定</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import Header from "@/components/Header";
export default {
    name: "Profile",
    data(){
        return{
            personalQuestions:[],
            replies:[],
            user:JSON.parse(window.sessionStorage.getItem("user")),
            total:'50',
            page:'1',
            size:'5',
            title:'我的问题',
            defaultActive:1,
        }
    },
    components:{
        Header,
    },
    mounted() {
        this.initSectionName();
    },
    methods:{
        initSectionName(){
            if (window.sessionStorage.getItem("notification")==="最新回复"){
                this.defaultActive=2;
                this.initReplies();
            }else{
                this.defaultActive=1;
                this.initQuestions();
            }
            window.sessionStorage.removeItem("notification");
        },
        goDetailByQuestionId(reply){
            this.putRequest("notification/status/"+reply.id).then(resp=>{
                if (resp){
                    console.log(resp)
                }
            })
            this.getRequest("question/"+reply.questionId).then(resp=>{
                if (resp){
                    console.log(resp)
                    window.sessionStorage.setItem("question", JSON.stringify(resp));
                    this.$router.push("/question")
                }
            })
        },
        initReplies(){
            this.getRequest("/notification/"+this.user.id+"?page="+this.page+"&size="+this.size).then(resp=>{
                if (resp){
                    console.log(resp);
                    this.title='最新回复';
                    this.replies =resp.data;
                    this.total=resp.total;
                }
            })
        },
        handleCurrentChange(currentPage){
            this.page=currentPage;
            this.initQuestions();
        },
        handleSizeChange(currentSize){
            this.size = currentSize;
            this.initQuestions();
        },
        initQuestions(){
            this.getRequest("question/profile/"+this.user.id+"?page="+this.page+"&size="+this.size).then(resp=>{
                if (resp){
                    this.title='我的问题';
                    console.log(resp.data)
                    this.personalQuestions=resp.data;
                    this.total=resp.total;
                    console.log(this.personalQuestions)
                }
            })
        },
        goDetail(question){
            this.getRequest("question/"+question.id).then(resp=>{
                if (resp){
                    console.log(resp)
                    window.sessionStorage.setItem("question", JSON.stringify(resp));
                    this.$router.push("/question")
                }
            })
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
.unRead{
    margin-left: 10px;
    background-color: #b92c28;
    border-radius: 5px;
    padding: 3px;
    color: white
}
.indexAside{
    margin-left: 1px;
    background-color: white;
    box-sizing: border-box;
    display: list-item;
    align-items: baseline;
    justify-content: right;
}

</style>
<style scoped>
.el-divider--horizontal {
    display: block;
    height: 1px;
    width: 90%;
    margin: 12px 0;
}
.msg-pagination-container{
    display: flex;
    justify-content: flex-end;
}
/*加deep才可以修改原生样式*/
/deep/ .el-pagination .btn-next {
    width: 10px;
}
/deep/ .el-pagination .btn-prev{
    width: 10px;
}
/deep/ .el-pagination__total{
    margin-right: 0;
    margin-left: 5px;
}
/*加deep才可以修改原生样式*/
/deep/ .msg-pagination-container .el-input__inner{
    margin-top: 0;
}
</style>