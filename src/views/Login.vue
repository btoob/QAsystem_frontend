<template>
    <div ref="content" class="content">
            <div class="form sign-in">
                <el-form ref="loginForm" :rules="rules" :model="loginForm">
                    <h2>欢迎回来</h2>
                    <label>
                        <span>用户名</span>
                        <el-form-item prop="username">
                            <el-input type="text" v-model="loginForm.username" />
                        </el-form-item>
                    </label>
                    <label>
                        <span>密码</span>
                        <el-form-item prop="password">
                            <el-input type="password" v-model="loginForm.password"/>
                        </el-form-item>
                    </label>
                    <p class="forgot-pass"><a href="javascript:">忘记密码？</a></p>
                    <button type="button" class="submit" @click="submitLogin">登 录</button>
                    <button type="button" class="fb-btn">使用 <span>facebook</span> 帐号登录</button>
                </el-form>
            </div>
        <div class="sub-cont">
            <div class="img">
                <div class="img__text m--up">
                    <h2>还未注册？</h2>
                    <p>立即注册，发现大量机会！</p>
                </div>
                <div class="img__text m--in">
                    <h2>已有帐号？</h2>
                    <p>有帐号就登录吧，好久不见了！</p>
                </div>
                <div @click="click_img_btn" class="img__btn">
                    <span class="m--up">注 册</span>
                    <span class="m--in">登 录</span>
                </div>
            </div>
            <div class="form sign-up">
                <h2>立即注册</h2>
                <label>
                    <span>用户名</span>
                    <el-input type="text" />
                </label>
                <label>
                    <span>邮箱</span>
                    <el-input type="email" />
                </label>
                <label>
                    <span>密码</span>
                    <el-input type="password" />
                </label>
                <button type="button" class="submit">注 册</button>
                <button type="button" class="fb-btn">使用 <span>facebook</span> 帐号注册</button>
            </div>
        </div>
    </div>
</template>
<script>
import "@/static/css/style.css"

export default {
    name: "Login",
    data(){
        return{
            rules:{
                username:[{required:true, message:"请输入用户名！", trigger:"blur"}],
                password:[{required:true, message:"请输入密码！", trigger:"blur"}],
            },
            loginForm:{
                username:"于禁",
                password:"123",
            },
        }
    },
    methods:{
        click_img_btn(){
            this.$refs.content.classList.toggle('s--signup')
        },
        submitLogin(){
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.postKeyValueRequest("/login", this.loginForm).then(resp=>{
                        if (resp){
                            // alert(JSON.stringify(resp));
                            this.$router.push("/index")
                        }
                    })
                } else {
                    this.$message.error('请输入用户名和密码！');
                    return false;
                }
            });
        }
    }
}
</script>

<style>
.form .el-input__inner{
    border-radius:0;
    border-top-width: 0;
    border-left-width: 0;
    border-right-width: 0;
    border-bottom-width: 2px;
    color: #0f0f0f;
}
</style>