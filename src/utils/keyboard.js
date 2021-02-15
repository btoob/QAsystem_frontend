let keys = {}

export function addKeyboardKey (e) {
    // 别用已经废弃的 keycode 字段
    keys[e.key] = true
}

export function removeKeyboardKey (e) {
    delete keys[e.key]
}

export function clearKeyboardKeys () {
    keys = {}
}

export function isCtrlPress(e) {
    return keys['Control']
}