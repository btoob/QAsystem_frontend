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
                    <router-link to="/publish">
                    <el-button icon="el-icon-edit" type="text"
                               style="color: #000000;width: auto;height: auto;margin-right: 25px"
                               size="normal" @click="goChat">发布</el-button></router-link>
                    <el-dropdown class="userInfo" @command="commandHandler" trigger="click" style="cursor: pointer">
                        <span class="el-dropdown-link">
                        {{ user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
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
                    <i class="el-icon-files" style="margin-bottom: 15px" >   发现</i>
                    <el-divider></el-divider>
                    <el-row v-for="(question, index) in questions" :key="index">
                        <div style=" display: flex;align-items: flex-start">
                            <el-avatar size="large" shape="square" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-avatar>
                            <div style="margin-left: 10px">
                                <el-link @click="goDetail(question)" type="primary">{{ question.title }}</el-link> <br>
                                <span class="text_desc">
                                    <span>{{question.commentCount}}</span> 个回复 · <span>{{question.viewCount}}</span> 次浏览 · <span>{{question.updateTime}}</span>
                                </span>
                            </div>
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
                    <h3>热门标签</h3>
                </el-aside>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "Index",
        data(){
            return{
                questions:[],
                user:JSON.parse(window.sessionStorage.getItem("user")),
                total:'50',
                page:'1',
                size:'5',
            }
        },
        mounted() {
            this.initQuestions()
        },
        methods:{
            handleCurrentChange(currentPage){
                this.page=currentPage;
                this.initQuestions();
            },
            handleSizeChange(currentSize){
                this.size = currentSize;
                this.initQuestions();
            },
            initQuestions(){
                this.getRequest("question/?page="+this.page+"&size="+this.size).then(resp=>{
                    if (resp){
                        // alert(JSON.stringify(resp))
                        this.questions=resp.data;
                        this.total=resp.total;
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
.msg-pagination-container{
    display: flex;
    justify-content: flex-end;
}
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
/deep/ .msg-pagination-container .el-input__inner{
    margin-top: 0;
}
</style>