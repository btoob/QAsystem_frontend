<template>
    <div>
        <el-container>
            <el-header class="indexHeader" height="50px">
                <Header></Header>
            </el-header>

            <el-container class="indexContainer">
                <el-main class="indexMain">
                    <i class="el-icon-files" style="margin-bottom: 12px;margin-top: 10px"> 发现</i>

                    <el-menu default-active="1" class="el-menu-demo" mode="horizontal" style="float: right;">
                        <el-menu-item index="1" @click="initNewQuestions()">最新</el-menu-item>
                        <el-menu-item index="2" @click="initHotQuestions()">最热</el-menu-item>
                        <el-menu-item index="3" @click="initZeroQuestions()">消灭零回复</el-menu-item>
                    </el-menu>

                    <el-divider style="margin-top: 5px"></el-divider>

                    <el-row v-for="(question, index) in questions" :key="index">
                        <div style=" display: flex;align-items: flex-start">
                            <!--                            <el-avatar size="large" shape="square" :src="user.userFace" referrerPolicy="no-referrer"></el-avatar>-->
                            <el-image referrerPolicy="no-referrer" class="imgCircle"
                                      style="width: 40px; height: 40px"
                                      :src="question.user.userFace"
                                      :fit="fit"></el-image>
                            <div style="margin-left: 10px">
                                <el-link @click="goDetail(question)" type="primary">{{ question.title }}</el-link>
                                <br>
                                <span class="text_desc">
                                    <span>{{ question.commentCount }}</span> 个回复 · <span>{{ question.viewCount }}</span> 次浏览 · <span>{{
                                        question.updateTime
                                    }}</span>
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
                            :page-size="10"
                            @current-change="handleCurrentChange"
                            @size-change="handleSizeChange"
                            layout="sizes, prev, pager, next, jumper, ->, total, slot"
                            :total="total">
                        </el-pagination>
                    </div>

                </el-main>
                <el-aside width="300px" class="indexAside">
                    <span style="font-family: 黑体,serif;color: #0f0f0f">给点钱吧</span>
                    <img width="222" height="246" src="../static/images/weixin.png">
                    <el-divider></el-divider>
                    <div>
                        <el-row v-for="(secKillGood, index) in secKillGoods" :key="index">
                            <div style="display: flex;justify-content: center">
                                这里有
                                <span style="color: red;margin-right: 5px;margin-left: 5px;cursor: pointer"
                                      @click="saveOrder(secKillGood)">
                                    {{ secKillGood.name }}
                                </span>
                                快抢
                            </div>
                        </el-row>
                    </div>
                    <el-divider></el-divider>
                    <div>热门标签</div>
                    <div style="display:flex;margin-top: 10px">
                        <div style="margin-right: 8px" v-for="(tag, i) in hotTags">
                            <el-tag type="warning" size="mini">
                                <el-link @click="initQuestionByTag(tag)">{{ tag }}</el-link>
                            </el-tag>
                        </div>
                    </div>
                    <el-divider></el-divider>
                </el-aside>
            </el-container>
            <el-footer>
                <Footer></Footer>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
import Header from "../components/Header";
import Footer from "@/components/Footer";
import func from "@/utils/func";

export default {
    name: "Index",
    data() {
        return {
            questions: [],
            user: JSON.parse(window.sessionStorage.getItem("user")),
            total: '50',
            page: '1',
            size: '10',
            sectionName: '我的问题',
            notificationNum: 0,
            searchInput: '',
            hotTags: [],
            questionType: 0,
            secKillGoods: [],
        }
    },
    components: {
        Header,
        Footer,
    },
    created() {
        this.initQuestions("最新");
        this.initHotTags();
        this.initNotificationNum();
        this.initSecKillGoods();
    },
    mounted() {
        // this.initQuestions();
        //
        // this.initHotTags();
        // this.initNotificationNum();
        //Header页面调用本页面的方法   searchInput为Header中传过来的参数
        func.$on("demo", (searchInput) => {
            this.searchInput = searchInput;
            this.initQuestions("最新");
        })
    },
    beforeRouteLeave(to, from, next) {
        window.sessionStorage.setItem("notification", this.sectionName);
        next()
    },
    methods: {
        saveOrder(secKillGood) {
            if (this.user === null) {
                this.$confirm('此操作需要登录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    window.sessionStorage.removeItem("user")
                    window.sessionStorage.removeItem("question");
                    this.$router.replace("/login");
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            } else {
                this.getRequest("seckill/saveOrder/?id=" + secKillGood.id + "&userId=" + this.user.id).then(resp => {
                    if (resp) {
                        this.$message({
                            message: resp.msg,
                            center: true,
                            duration: 6000,
                        });
                    }
                })
            }
        },
        initSecKillGoods() {
            this.getRequest("seckill/").then(resp => {
                if (resp) {
                    this.secKillGoods = resp;
                }
            })
        },
        initQuestionByTag(tag) {
            this.getRequest("question/tag/" + tag).then(resp => {
                if (resp) {
                    this.questions = []
                    this.total = '0'
                    this.questions = resp.data;
                    this.total = resp.total;
                }

            })
        },
        initHotTags() {
            this.getRequest("question/hotTags").then(resp => {
                if (resp) {
                    this.hotTags = resp
                }
            })
        },
        initNotificationNum() {
            if (this.user !== null) {
                this.getRequest("notification/notificationNum/" + this.user.id).then(resp => {
                    if (resp) {
                        this.notificationNum = resp.object;
                    }
                })
            }
        },
        goNotification() {
            this.sectionName = '最新回复';
        },
        handleCurrentChange(currentPage) {
            this.page = currentPage;
            if (this.questionType === 0) {
                this.initQuestions("最新");
            } else if (this.questionType === 1) {
                this.initQuestions("最热");
            } else if (this.questionType === 2) {
                this.initQuestions("零回复");
            }
        },
        handleSizeChange(currentSize) {
            this.size = currentSize;
            if (this.questionType === 0) {
                this.initQuestions("最新");
            } else if (this.questionType === 1) {
                this.initQuestions("最热");
            } else if (this.questionType === 2) {
                this.initQuestions("零回复");
            }
        },
        initNewQuestions() {
            this.questionType = 0
            this.initQuestions("最新");
        },
        initHotQuestions() {
            this.questionType = 1
            this.initQuestions("最热");
        },
        initZeroQuestions() {
            this.questionType = 2
            this.initQuestions("零回复");
        },
        initQuestions(questionType) {
            if (questionType === "最新") {
                let url = "question/?page=" + this.page + "&size=" + this.size;
                // this.searchInput = window.sessionStorage.getItem("searchInput");
                // window.sessionStorage.removeItem("searchInput");
                if (this.searchInput !== null) {
                    url += "&search=" + this.searchInput;
                    // console.log(url)
                }
                this.getRequest(url).then(resp => {
                    if (resp) {
                        // alert(JSON.stringify(resp))
                        //将问题中的tags由字符串转化为数组
                        for (let i = 0; i < resp.data.length; i++) {
                            resp.data[i].tag = resp.data[i].tag.split(",")
                        }
                        this.questions = resp.data;
                        this.total = resp.total;
                    }
                })
            } else if (questionType === "最热") {
                this.getRequest("/question/hot/?page=" + this.page + "&size=" + this.size).then(resp => {
                    if (resp) {
                        for (let i = 0; i < resp.data.length; i++) {
                            resp.data[i].tag = resp.data[i].tag.split(",")
                        }
                        this.questions = resp.data;
                        this.total = resp.total;
                    }
                })
            } else if (questionType === "零回复") {
                this.getRequest("/question/noReply/?page=" + this.page + "&size=" + this.size).then(resp => {
                    if (resp) {
                        for (let i = 0; i < resp.data.length; i++) {
                            resp.data[i].tag = resp.data[i].tag.split(",")
                        }
                        this.questions = resp.data;
                        this.total = resp.total;
                    }
                })
            }
        },
        goDetail(question) {
            //可以直接使用参数question, 不用再去调接口查, 后端将增加浏览数的操作放在了这个接口里面
            this.getRequest("question/" + question.id).then(resp => {
                if (resp) {
                    console.log(resp)
                    resp.tag = resp.tag.split(",")
                    window.sessionStorage.setItem("question", JSON.stringify(resp));
                    this.$router.replace("/question")
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
            } else if (cmd === 'userinfo') {
                this.$router.replace("/profile")
            }
        }
    }
}
</script>

<style>
.noticeNum {
    margin-left: 5px;
    background-color: #8c939d;
    border-radius: 5px;
    padding: 3px
}

.imgCircle {
    border-radius: 5px;
}

.indexContainer {
    margin-left: 150px;
    margin-right: 150px;
}

.indexAside {
    margin-left: 1px;
    background-color: white;
    box-sizing: border-box;
    display: flex;
    align-items: baseline;
    justify-content: left;
    padding: 20px;
}

.indexMain {
    background-color: white;
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
    font-family: 黑体, serif;
    color: gray;
    margin-right: 20px;
}

.el-icon-files {
    font-size: 25px;
    font-family: 黑体, serif;
    color: gray;
    border-bottom: #1b6d85;
}

.text_desc {
    font-size: 10px;
    font-family: 黑体, serif;
    color: gray;
}


</style>
<style scoped>
.el-divider--horizontal {
    display: block;
    height: 1px;
    width: 90%;
    margin: 12px 0;
}

.msg-pagination-container {
    display: flex;
    justify-content: flex-end;
}

/*加deep才可以修改原生样式*/
/deep/ .el-pagination .btn-next {
    width: 10px;
}

/deep/ .el-pagination .btn-prev {
    width: 10px;
}

/deep/ .el-pagination__total {
    margin-right: 0;
    margin-left: 5px;
}

/*加deep才可以修改原生样式*/
/deep/ .msg-pagination-container .el-input__inner {
    margin-top: 0;
}
</style>