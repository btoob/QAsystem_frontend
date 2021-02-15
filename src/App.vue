<template>
    <div id="app">
        <router-view/>
    </div>
</template>
<script>
import {removeKeyboardKey, addKeyboardKey, clearKeyboardKeys} from '@/utils/keyboard'
export default {
    name: "App",
    created() {
        // 添加监听
        window.addEventListener('blur', clearKeyboardKeys)
        window.addEventListener('keydown', addKeyboardKey)
        window.addEventListener('keyup', removeKeyboardKey)
        // 记住添加事件和卸载事件总是成对存在
        this.$once('hook:beforeDestroy', () => {
            window.removeEventListener('blur', clearKeyboardKeys)
            window.removeEventListener('keydown', addKeyboardKey)
            window.removeEventListener('keyup', removeKeyboardKey)
        })
    }
}
</script>