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
                        {{ user.name }}<i class="el-icon-arrow-down el-icon--right"></i>
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
                    <i class="el-icon-document-add" style="margin-bottom: 10px" >   发起</i>
                    <el-divider></el-divider>
                    <div>
                        <el-form label-position="top" label-width="40px" :model="formLabelAlign" >
                            <el-form-item label="问题标题(简单扼要)" class="item">
                                <el-input v-model="formLabelAlign.title" style="width: 50%;" class="e_input"></el-input>
                            </el-form-item>
                            <el-form-item label="问题补充 (必填，请参照右侧提示):" class="item">
                                <el-input :autosize="{ minRows: 4, maxRows: 8}" v-model="formLabelAlign.description" type="textarea"></el-input>
                            </el-form-item>
                            <el-form-item label="添加标签:" class="item">
<!--                                <el-autocomplete  v-model="formLabelAlign.tag"  style="width: 50%;" class="e_input"></el-autocomplete>-->
<!--                                <el-input v-model="formLabelAlign.tag">-->
                                <el-cascader :show-all-levels="false" v-model="selectedOptions"
                                    :options="tagDTOs"
                                    :props="props"
                                    clearable style="margin-top: 0"></el-cascader>
<!--                                </el-input>-->
<!--                                <el-cascader v-model="formLabelAlign.tag" :options="options" :show-all-levels="false"></el-cascader>-->

                            </el-form-item>
                        </el-form>
                    </div>
                    <div style="display: flex;justify-content: flex-end" >
                        <el-button type="primary" style="width: auto;height: auto" @click="doPublish">{{buttonValue}}</el-button>
                    </div>
                </el-main>
                <el-aside width="300px" class="indexAside">
                    <div>
                        <div>问题发起指南</div>
                        • 问题标题: 请用精简的语言描述您发布的问题，不超过25字
                        • 问题补充: 详细补充您的问题内容，并确保问题描述清晰直观, 并提供一些相关的资料：
                        服务器运行环境信息；
                        软件版本；
                        问题发生的上下文信息；
                        可以完整复现问题的代码（如可直接运行于 Kibana Console 的复现流程）；
                        补充完整的异常和错误信息；
                        注意阅读格式友好，代码和异常信息请用代码标签格式化张贴；
                        • 选择标签: 选择一个或者多个合适的标签，不超过10个字
                    </div>
                </el-aside>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "Publish",
        data(){
            return{
                user:JSON.parse(window.sessionStorage.getItem("user")),
                question:JSON.parse(window.sessionStorage.getItem("question")),
                formLabelAlign: {
                    title: '',
                    description: '',
                    tag: '',
                    userId: '',
                },
                selectedOptions:[],
                buttonValue:'确认发起',
                tagDTOs:[],
                props: { multiple: true },
            }
        },
        mounted() {
            this.showEditData();
            this.getTags();
        },
        methods:{
            getTags(){
                this.getRequest("/publish/getTags/").then(resp=>{
                    if(resp){
                        this.tagDTOs=resp.object;
                    }
                })
            },
            goPublish(){
                //从导航栏发布按钮跳转到发布页面
                window.sessionStorage.removeItem("question");
                this.buttonValue='确认发起';
                this.formLabelAlign={
                    id:'',
                    title: '',
                    description: '',
                    tag: '',
                    userId: '',}
                this.$router.replace("/publish")
            },
            showEditData(){
                //从问题详情页面中的edit按钮跳转到发布问题页面, 是为了修改
                //需要将问题详情中的属性回显到问题发布栏中
                if (this.question!=null){
                    this.buttonValue='确认修改';
                    this.formLabelAlign.title=this.question.title;
                    this.formLabelAlign.description=this.question.description;
                    this.formLabelAlign.tag=this.question.tag;
                    this.formLabelAlign.userId=this.question.userId;
                }
            },
            doEdit(){

            },
            doPublish(){
                this.formLabelAlign.userId=this.user.id
                if (this.buttonValue==='确认发起'){
                    console.log(this.selectedOptions)
                    this.formLabelAlign.tag=this.selectedOptions[0][1]
                    this.postRequest("/publish/",this.formLabelAlign).then(resp=>{
                        if (resp){
                            console.log(resp)
                            this.$router.push("/index")
                        }
                    })
                }else{
                    this.formLabelAlign.id=this.question.id;
                    this.putRequest("/publish/update/", this.formLabelAlign).then(resp=>{
                        if (resp){
                            console.log(resp)
                            this.$router.replace("/index")
                        }
                    })
                }
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


<style scoped>
.el-divider--horizontal {
    display: block;
    height: 1px;
    width: 80%;
    margin: 12px 0;
}
.el-icon-document-add{
    font-size: 25px;
    font-family: 黑体,serif ;
    color: gray;
    border-bottom: #1b6d85;
}
</style>
<style>
.item .el-form-item__label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 20px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
    margin-top: 15px;
}
.e_input .el-input__inner{
    text-align: left;
}
</style>
