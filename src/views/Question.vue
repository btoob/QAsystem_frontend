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
            <el-container class="indexContainer">
                <el-main class="indexMain">
                    <div style="margin-left: 10px">
                        <i class="el-icon-files" style="margin-bottom: 15px" >   {{question.title}}</i> <br>
                        <span class="text_desc">
                            <span>{{question.commentCount}}</span> 个回复 | <span>{{question.viewCount}}</span> 次浏览 | 发布时间: <span>{{question.updateTime}} | <router-link to="/publish" v-if="question.userId===user.id">
                        <el-button icon="el-icon-edit-outline" type="text"
                                   style="padding-top: 0;padding-bottom: 0; color:
                                   #000000;width: auto;height: auto;font-family: 黑体,serif ;color: gray;
                                   align-items: center"
                                   size="normal" @click="goEdit">编辑</el-button></router-link></span>

                        </span>
                    </div>
                    <el-divider></el-divider>
                    <span style="margin-left: 25px">{{question.description}}</span>
                    <el-divider></el-divider>
                    <div style="display:flex;">

                        <div style="margin-left: 20px;" v-for="(tag, i) in question.tag">
                            <el-tag type="warning" size="mini">{{ tag }}</el-tag>
                        </div>
                    </div>
                    <el-divider></el-divider>

                    <!--加载一级评论-->
                    <div>
                        <h4 class="comCount" v-show="comments.length!==0">{{comments.length}}个回复</h4>
                        <el-divider v-if="comments.length!==0"></el-divider>
                        <el-row v-for="(comment, index) in comments" :key="index" style="margin-left: 20px">
                            <div style=" display: flex;align-items: flex-start">
                                <el-image referrerPolicy="no-referrer" class="imgCircle"
                                          style="width: 40px; height: 40px"
                                          :src="comment.user.userFace"
                                          :fit="fit"></el-image>
                                <div style="margin-left: 15px">
                                    <span style="font-size: 10px;font-family: 黑体,serif ;color: gray;">{{comment.user.name}}</span>
                                    <div>
                                        <span>{{comment.content}}</span>
                                    </div>
                                </div>
                            </div>
                            <!--点赞+二级评论-->
                            <div style="margin-top: 10px;margin-left: 50px;font-size: 20px;font-family: 黑体,serif ;color: gray;" class="text_desc">
                                <el-badge :value=agree class="item" type="info">
                                    <el-button icon="el-icon-check" type="info" plain size="mini"
                                               style="color: #000000;width: auto;height: auto;"
                                               @click="doAgree"></el-button>
                                </el-badge>
                                <el-badge :value="disagree" class="item" type="info">
                                <el-button icon="el-icon-close" type="info" plain size="mini"
                                           style="color: #000000;width: auto;height: auto;margin-left: 10px"
                                           @click="doDisagree"></el-button></el-badge>
                                <!--二级评论按钮-->

                                <el-badge :value=agree class="item" type="info">
                                    <el-button icon="el-icon-chat-dot-square" type="info" plain size="mini"
                                               style="color: #000000;width: auto;height: auto;margin-left: 10px"
                                               ></el-button>
                                </el-badge>

                            </div>
                            <div v-show="showSecondaryComments===true">在这里二级评论

                            </div>
                            <el-divider style="margin-top: 3px"></el-divider>


                        </el-row>
                    </div>

                    <!--添加评论-->
                    <div style=" display: flex;align-items: flex-start;margin-top: 15px">
                        <el-image referrerPolicy="no-referrer" class="imgCircle"
                                  style="width: 40px; height: 40px"
                                  :src="user.userFace"
                                  :fit="fit"></el-image>
                        <div style="margin-left: 10px;">
                            <span style="font-size: 10px;font-family: 黑体,serif ;color: gray;">{{ user.name }}</span> <br>
                        </div>
                    </div>
                    <el-form :model="commentForm">
                        <el-form-item>
                            <el-input style="margin-top: 10px"
                                      type="textarea"
                                      :rows="5"
                                      placeholder="请输入内容"
                                      v-model="commentForm.content">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <div style="display: flex;justify-content: flex-end;margin-top: 5px" >
                                <el-button type="primary" style="width: auto;height: auto" @click="doSubmitComment">提交</el-button>
                            </div>
                        </el-form-item>
                    </el-form>

                </el-main>
                <el-aside width="300px" class="indexAside">
                    <div style="margin-left: 15px">
                        <h4 style="margin-top: 10px;margin-bottom: 5px">发起人</h4>
                        <div style=" display: flex;align-items: flex-start">
                            <el-image referrerPolicy="no-referrer" class="imgCircle"
                                      style="width: 40px; height: 40px"
                                      :src="question.user.userFace"
                                      :fit="fit"></el-image>
                            <div style="margin-left: 10px;">
                                <span style="font-family: 黑体,serif;font-size:15px ">{{ question.user.name }}</span> <br>
                            </div>
                        </div>
                    </div>

                    <el-divider></el-divider>

                    <div style="margin-left: 15px">
                        <h4 style="margin-top: 10px;margin-bottom: 5px">相关问题</h4>
                        <el-row v-for="(related, i) in relatedQuestion">
                            <div v-if="related.title!==question.title" style="font-size: 13px"><el-link type="primary" @click="goDetail(related)" > {{ related.title }}</el-link></div>
                        </el-row>
                    </div>

                </el-aside>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {                                //注入App里的reload方法
    name: "Question",
    data(){
        return{
            question:JSON.parse(window.sessionStorage.getItem("question")),
            user:JSON.parse(window.sessionStorage.getItem("user")),
            canEdit:false,
            commentForm:{
                parentId:'',
                type:1,
                commentator:'',
                content:'',
            },
            comments:[],
            secondComments:[],
            agree:0,
            disagree:0,
            commentCount:0,
            showSecondaryComments:false,
            relatedQuestion:[],
        }
    },
    mounted() {
        if (this.question.userId===this.user.id){
            this.canEdit=true;
        }
        this.initComments();
        this.initRelatedQuestion();
    },
    beforeRouteLeave(to, from, next){
        if (this.canEdit===false && window.sessionStorage.getItem("question")){
            window.sessionStorage.removeItem("question");
        }
        next()
    },
    methods:{
        goDetail(related){
            this.getRequest("question/"+related.id).then(resp=>{
                if (resp){
                    console.log(resp)
                    window.sessionStorage.setItem("question", JSON.stringify(resp));
                    this.$router.go(0);
                }
            })
        },
        initRelatedQuestion(){
            let url = "/question/related?";
            this.question.tag.forEach(key=>{
                url+="tags="+key+"&";
            })
            this.getRequest(url).then(resp=>{
                if (resp){
                    console.log(resp)
                    this.relatedQuestion=resp;
                }
            })
        },
        doSubmitComment(){
            this.commentForm.parentId=this.question.id;
            this.commentForm.commentator=this.user.id;
            this.postRequest("/comment/", this.commentForm).then(resp=>{
                if (resp){
                    this.initComments();
                    this.commentForm.content='';
                }
            })
        },
        doAgree(){
          this.agree+=1
        },
        doDisagree(){this.disagree+=1},
        initComments(){
            this.getRequest("/comment/"+this.question.id).then(resp=>{
                if (resp){
                    this.comments=resp;
                }
            })
        },
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

</style>
<style scoped>
.el-divider--horizontal {
    display: block;
    height: 1px;
    width: 80%;
    margin: 12px 0;
}
.comCount{
    font-size: 20px;
    font-family: inherit;
    color: darkgray;
    border-bottom: #1b6d85;
}
</style>