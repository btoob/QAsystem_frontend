<template>
    <div>
        <el-container>
            <el-header class="indexHeader" height="50px">
                <Header></Header>
            </el-header>
            <el-container class="indexContainer">
                <el-main class="indexMain">
                    <div style="margin-left: 10px">
                        <i class="el-icon-files" style="margin-bottom: 15px"> {{ question.title }}</i> <br>
                        <span class="text_desc">
                            <span>{{ question.commentCount }}</span> 个回复 | <span>{{ question.viewCount }}</span> 次浏览 | 发布时间: <span>{{ question.updateTime }}
                            <el-link :underline="false" v-if="user!=null && question.userId===user.id">|
                        <el-button icon="el-icon-edit-outline" type="text"
                                   style="padding-top: 0;padding-bottom: 0; color:
                                   #000000;width: auto;height: auto;font-family: 黑体,serif ;color: gray;
                                   align-items: center;font-size: 13px;margin-bottom: 5px"
                                   size="normal" @click="goEdit">编辑</el-button></el-link></span>

                        </span>
                    </div>
                    <el-divider></el-divider>
                    <!--                    <span style="margin-left: 25px">{{question.description}}</span>-->
                    <mavon-editor :value="question.description" :subfield="false" :defaultOpen="'preview'"
                                  :toolbarsFlag="false" :editable="false" :scrollStyle="true" :ishljs="true"
                    ></mavon-editor>
                    <div style="display:flex; margin-top: 15px">
                        <div style="margin-left: 20px;" v-for="(tag, i) in question.tag">
                            <el-tag type="warning" size="mini">{{ tag }}</el-tag>
                        </div>
                    </div>
                    <el-divider></el-divider>

                    <!--加载一级评论-->
                    <div>
                        <a-list
                            class="comment-list"
                            :header="`${comments.length} replies`"
                            item-layout="horizontal"
                            :data-source="comments">
                            <a-list-item slot="renderItem" slot-scope="item, index">
                                <a-comment :author="item.user.name" :avatar="item.user.userFace">
                                    <template slot="actions">
                                        <span key="comment-basic-like">
                                            <a-tooltip title="Like">
                                              <a-icon type="like" :theme="item.action === 'liked' ? 'filled' : 'outlined'" @click="like(item)"/>
                                            </a-tooltip>
                                            <span style="padding-left: 3px;cursor: auto">
                                              {{ item.likeCount }}
                                            </span>
                                        </span>
                                        <span key="comment-basic-dislike">
                                            <a-tooltip title="Dislike">
                                            <a-icon
                                              type="dislike"
                                              :theme="item.action === 'disliked' ? 'filled' : 'outlined'"
                                              @click="dislike(item)"/>
                                            </a-tooltip>
                                            <span style="padding-left: 3px;cursor: auto">
                                            {{ item.dislikeCount  }}
                                            </span>
                                        </span>
                                        <span key="comment-basic-reply-to">Reply to</span>
                                    </template>
                                    <p slot="content">
                                        {{ item.content }}
                                    </p>
                                    <a-tooltip slot="datetime"
                                               :title="moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')">
                                        <span>{{ moment(item.createTime).fromNow() }}</span>
                                    </a-tooltip>

                                </a-comment>
                            </a-list-item>
                        </a-list>
                    </div>
                    <div v-if="user!==null">
                        <a-comment>
                            <a-avatar
                                slot="avatar"
                                :src="user.userFace"
                                alt="Han Solo"/>
                            <div slot="content">
                                <a-form-item>
                                    <a-textarea :rows="4" :value="value" @change="handleChange"/>
                                </a-form-item>
                                <a-form-item>
                                    <a-button html-type="submit" :loading="submitting" type="primary"
                                              @click="handleSubmit">
                                        Add Comment
                                    </a-button>
                                </a-form-item>
                            </div>
                        </a-comment>
                    </div>
                    <div v-else style="display: flex;justify-content: center">回复问题请先
                        <router-link to="/login">登录</router-link>
                    </div>

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
                            <div v-if="related.title!==question.title" style="font-size: 13px">
                                <el-link type="primary" @click="goDetail(related)"> {{ related.title }}</el-link>
                            </div>
                        </el-row>
                    </div>

                </el-aside>
            </el-container>
            <el-footer>
                <Footer></Footer>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import moment from "moment";

export default {                                //注入App里的reload方法
    name: "Question",
    data() {
        return {
            question: JSON.parse(window.sessionStorage.getItem("question")),
            user: JSON.parse(window.sessionStorage.getItem("user")),
            canEdit: false,
            commentForm: {
                parentId: '',
                type: 1,
                commentator: '',
                content: '',
            },
            comments: [],
            secondComments: [],
            likes: 0,
            dislikes: 0,
            commentCount: 0,
            showSecondaryComments: false,
            relatedQuestion: [],
            moment,
            submitting: false,
            value: '',
            action: null,
        }
    },
    components: {
        Header,
        Footer,
    },
    mounted() {
        if (this.user !== null && this.question.userId === this.user.id) {
            this.canEdit = true;
        }
        this.initComments();
        this.initRelatedQuestion();
    },
    beforeRouteLeave(to, from, next) {
        if (this.canEdit === false && window.sessionStorage.getItem("question")) {
            window.sessionStorage.removeItem("question");
        }
        next()
    },
    methods: {
        handleChange(e) {
            this.commentForm.content = e.target.value;
        },
        handleSubmit() {
            this.submitting = true;
            this.commentForm.parentId = this.question.id;
            this.commentForm.commentator = this.user.id;
            setTimeout(()=>{
                this.submitting = false;
                this.postRequest("/comment/", this.commentForm).then(resp => {
                    if (resp) {
                        this.initComments();
                        this.commentForm.content = '';
                    }
                })
            },1000)
        },
        goEdit() {
            this.$router.replace("/publish");
        },
        goDetail(related) {
            this.getRequest("question/" + related.id).then(resp => {
                if (resp) {
                    console.log(resp)
                    resp.tag = resp.tag.split(",")
                    window.sessionStorage.setItem("question", JSON.stringify(resp));
                    this.$router.go(0);
                }
            })
        },
        initRelatedQuestion() {
            let url = "/question/related?";
            this.question.tag.forEach(key => {
                url += "tags=" + key + "&";
            })
            this.getRequest(url).then(resp => {
                if (resp) {
                    // console.log(resp)
                    this.relatedQuestion = resp;
                }
            })
        },
        like(comment) {
            comment.likeCount+=1;
            comment.action = 'liked';
        },
        dislike(comment) {
            comment.dislikeCount+=1;
            comment.action = 'disliked';
        },
        initComments() {
            this.getRequest("/comment/" + this.question.id).then(resp => {
                if (resp) {
                    //加个action方面后面点赞时图标样式改变
                    for (let i = 0; i < resp.length; i++) {
                        resp[i].action=null;
                    }
                    console.log(resp)
                    this.comments = resp;
                }
            })
        },
        goPublish() {
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

.comCount {
    font-size: 20px;
    font-family: inherit;
    color: darkgray;
    border-bottom: #1b6d85;
}
</style>