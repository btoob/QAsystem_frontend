<template>
    <div>
        <el-container>
            <el-header class="indexHeader" height="50px">
                <Header></Header>
            </el-header>
            <el-container class="indexContainer">
                <el-main class="indexMain">
                    <i class="el-icon-document-add" style="margin-bottom: 10px"> 发起</i>
                    <el-divider></el-divider>
                    <div>
                        <el-form label-position="top" label-width="40px" :model="formLabelAlign">
                            <el-form-item label="问题标题(简单扼要)" class="item">
                                <el-input v-model="formLabelAlign.title" style="width: 50%;" class="e_input"></el-input>
                            </el-form-item>
                            <el-form-item label="问题补充 (必填，请参照右侧提示):" class="item">
<!--                                <el-input :autosize="{ minRows: 4, maxRows: 8}" v-model="formLabelAlign.description"-->
<!--                                          type="textarea"></el-input>-->
                                <mavon-editor :ishljs = "true" v-model="formLabelAlign.description" ref="md" @imgAdd="imgAdd" @imgDel="imgDel"/>
                            </el-form-item>
                            <el-form-item label="添加标签:" class="item">
                                <el-cascader :show-all-levels="false" v-model="selectedOptions"
                                             :options="tagDTOs"
                                             :props="props"
                                             clearable style="margin-top: 0"></el-cascader>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div style="display: flex;justify-content: flex-end">
                        <el-button type="primary" style="width: auto;height: auto" @click="doPublish">
                            {{ buttonValue }}
                        </el-button>
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
import Header from "../../components/Header";
import axios from 'axios'
export default {
    name: "Publish",
    data() {
        return {
            user: JSON.parse(window.sessionStorage.getItem("user")),
            question: JSON.parse(window.sessionStorage.getItem("question")),
            formLabelAlign: {
                title: '',
                description: '',
                tag: '',
                userId: '',
            },
            selectedOptions: [],
            buttonValue: '确认发起',
            tagDTOs: [],
            props: {multiple: true},
        }
    },
    components:{
        Header,
    },
    mounted() {
        this.showEditData();
        this.getTags();
    },
    methods: {
        imgAdd (pos, $file) {
            let formData = new FormData()
            formData.append('file', $file)
            axios({
                url: '/file/upload',
                method: 'post',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' ,
                    'aaa':'aaa'
                },
            }).then((resp) => {
                // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
                //    this.$vm.$img2Url(pos, url.data);
                console.log(resp)
                this.$refs.md.$img2Url(pos, resp.object);
            })
        },
        imgDel (pos) {
            delete this.imgFile[pos]
        },
        getTags() {
            this.getRequest("/publish/getTags/").then(resp => {
                if (resp) {
                    this.tagDTOs = resp.object;
                }
            })
        },
        goPublish() {
            //从导航栏发布按钮跳转到发布页面
            window.sessionStorage.removeItem("question");
            this.buttonValue = '确认发起';
            this.formLabelAlign = {
                id: '',
                title: '',
                description: '',
                tag: '',
                userId: '',
            }
            this.$router.replace("/publish")
        },
        showEditData() {
            //从问题详情页面中的edit按钮跳转到发布问题页面, 是为了修改
            //需要将问题详情中的属性回显到问题发布栏中
            if (this.question != null) {
                this.buttonValue = '确认修改';
                this.formLabelAlign.title = this.question.title;
                this.formLabelAlign.description = this.question.description;
                this.formLabelAlign.tag = this.question.tag;
                this.formLabelAlign.userId = this.question.userId;
            }
        },
        doEdit() {

        },
        doPublish() {
            this.formLabelAlign.userId = this.user.id
            if (this.buttonValue === '确认发起') {
                console.log(this.selectedOptions)
                for (let i = 0; i < this.selectedOptions.length; i++) {
                    if (i !== this.selectedOptions.length - 1) {
                        this.formLabelAlign.tag += this.selectedOptions[i][1] + ',';
                    }else{
                        this.formLabelAlign.tag += this.selectedOptions[i][1];
                    }
                }
                // this.formLabelAlign.tag=this.selectedOptions[0][1]
                this.postRequest("/publish/", this.formLabelAlign).then(resp => {
                    if (resp) {
                        console.log(resp)
                        this.$router.replace("/index")
                    }
                })
            } else {
                this.formLabelAlign.id = this.question.id;
                this.putRequest("/publish/update/", this.formLabelAlign).then(resp => {
                    if (resp) {
                        // console.log(resp)
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

.el-icon-document-add {
    font-size: 25px;
    font-family: 黑体, serif;
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

.e_input .el-input__inner {
    text-align: left;
}
</style>
