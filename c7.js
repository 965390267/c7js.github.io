class Canvas {
    constructor() {
        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')
        this.responsive()
        this.setDefaultCursor()
    }

    launch(component, reLayout) {
        this.component = component
        this.reLayout = reLayout
        // 读取图片尺寸, 重新排版
        for (let child of component.children) {
            if (child.constructor.name === 'ImageComponent') {
                child.setBox()
                reLayout()
            }
        }
        setInterval(() => {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.draw(component)
        }, 1000/60)
    }

    draw(component) {
        component.draw()
        for (let child of component.children) {
            this.draw(child)
        }
    }

    responsive() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth
            this.canvas.height = window.innerHeight
            this.component.style['width'].value = this.canvas.width
            this.component.style['height'].value = this.canvas.height
            this.reLayout()
        })
    }

    setDefaultCursor() {
        window.addEventListener('mousemove', () => {
            document.body.style.cursor = 'auto'
        })
    }
}


class Component {
    constructor(component, context) {
        this.vm = null
        this.parent = component.parent
        this.props = component.props
        this.style = component.style
        this.context = context
        this.layout = {}
        this.children = []
    }

    roundedRect(x, y, width, height, radius, color, style="solid"){
        let lineWidth = this.context.lineWidth
        if (style === 'dotted') {
            this.context.setLineDash([lineWidth, lineWidth])
        } else if (style === 'dashed') {
            this.context.setLineDash([4 * lineWidth, 4 * lineWidth])
        }
        x += lineWidth / 2
        y += lineWidth / 2
        width -= lineWidth
        height -= lineWidth
        this.context.beginPath()
        this.context.strokeStyle = color
        this.context.moveTo(x, y + radius)
        this.context.lineTo(x, y + height - radius)
        this.context.quadraticCurveTo(x, y + height, x + radius, y + height)
        this.context.lineTo(x + width - radius, y + height)
        this.context.quadraticCurveTo(x + width, y + height, x + width, y + height - radius)
        this.context.lineTo(x + width, y + radius)
        this.context.quadraticCurveTo(x + width, y, x + width - radius, y)
        this.context.lineTo(x + radius, y)
        this.context.quadraticCurveTo(x, y, x, y + radius)
        this.context.stroke()
        this.context.setLineDash([])
    }

    hover(enterCallback, leaveCallback) {
        window.addEventListener('mousemove', (event) => {
            if (event.clientX >= this.layout.left &&
                event.clientX <= this.layout.right &&
                event.clientY >= this.layout.top &&
                event.clientY <= this.layout.bottom)
            {
                enterCallback(event)
            } else {
                leaveCallback && leaveCallback(event)
            }
        })
    }

    mousedown(callback) {
        window.addEventListener('mousedown', (event) => {
            if (event.clientX >= this.layout.left &&
                event.clientX <= this.layout.right &&
                event.clientY >= this.layout.top &&
                event.clientY <= this.layout.bottom)
            {
                callback(event)
            }
        })
    }

    mouseup(callback) {
        window.addEventListener('mouseup', (event) => {
            if (event.clientX >= this.layout.left &&
                event.clientX <= this.layout.right &&
                event.clientY >= this.layout.top &&
                event.clientY <= this.layout.bottom)
            {
                callback(event)
            }
        })
    }

    mousemove(callback) {
        window.addEventListener('mousemove', (event) => {
            if (event.clientX >= this.layout.left &&
                event.clientX <= this.layout.right &&
                event.clientY >= this.layout.top &&
                event.clientY <= this.layout.bottom)
            {
                callback(event)
            }
        })
    }

    click(callback) {
        window.addEventListener('click', (event) => {
            if (event.clientX >= this.layout.left &&
                event.clientX <= this.layout.right &&
                event.clientY >= this.layout.top &&
                event.clientY <= this.layout.bottom)
            {
                callback(event)
            }
        })
    }

    dblclick(callback) {
        window.addEventListener('dblclick', (event) => {
            if (event.clientX >= this.layout.left &&
                event.clientX <= this.layout.right &&
                event.clientY >= this.layout.top &&
                event.clientY <= this.layout.bottom)
            {
                callback(event)
            }
        })
    }

    /*
    子类应实现如下方法:
    setBox()        // 设置宽高用于排版
    registerEvent() // 用于注册事件
    draw()          // 用于绘制组件
    */
}


class ButtonComponent extends Component {
    constructor(component, context) {
        super(component, context)
        this.borderColor = '#dcdfe6'
        this.backgroundColor = '#ffffff'
        this.labelColor = '#606266'
        this.registerEvent()
    }

    setBox() {
        this.style['width'] = {
            value: '100px',
        }
        this.style['height'] = {
            value: '40px',
        }
        this.context.font = '14px sans-serif'
        let labelWidth = this.context.measureText(this.props.label).width
        if (labelWidth >= 58) {
            this.style['width'].value = `${labelWidth + 42}px`
        }
    }

    registerEvent() {
        this.hover(() => {
            this.borderColor = '#c6e2ff'
            this.backgroundColor = '#ecf5ff'
            this.labelColor = '#409eff'
            document.body.style.cursor = 'pointer'
        }, () => {
            this.borderColor = '#dcdfe6'
            this.backgroundColor = '#ffffff'
            this.labelColor = '#606266'
        })
        this.mousedown(() => {
            this.borderColor = '#3a8ee6'
            this.labelColor = '#3a8ee6'
        })
        this.mouseup(() => {
            this.borderColor = '#c6e2ff'
            this.labelColor = '#409eff'
        })
        this.click(() => {
            this.props['@click']()
        })
    }

    draw() {
        // 边框
        let width = parseInt(this.style['width'].value)
        let height = parseInt(this.style['height'].value)
        this.roundedRect(this.layout.left, this.layout.top, width, height, 4, this.borderColor)
        // 背景
        this.context.fillStyle = this.backgroundColor
        this.context.fill()
        // 文字
        this.context.textBaseline = 'top'
        this.context.font = '14px sans-serif'
        this.context.fillStyle = this.labelColor
        let labelStart = { x: 21, y: 13}
        let labelWidth = this.context.measureText(this.props.label).width
        if (labelWidth < 58) {
            labelStart.x = (100 - labelWidth) / 2
        }
        this.context.fillText(this.props.label, this.layout.left + labelStart.x, this.layout.top + labelStart.y)
    }
}



class CheckboxComponent extends Component {
    constructor(component, context) {
        super(component, context)
        this.firstDraw = true
        this.value = false
        this.borderColor = '#dcdfe6'
        this.registerEvent()
    }

    get backgroundColor() {
        return this.value ? '#409eff' : '#ffffff'
    }

    get labelColor() {
        return this.value ? '#409eff' : '#606266'
    }

    setBox() {
        this.context.font = '14px sans-serif'
        let labelWidth = this.context.measureText(this.props.label).width
        this.style['width'] = {
            value: `${24 + labelWidth}px`,
        }
        this.style['height'] = {
            value: '14px',
        }
    }

    registerEvent() {
        this.hover(() => {
            this.borderColor = '#409eff'
            document.body.style.cursor = 'pointer'
        }, () => {
            this.borderColor = '#dcdfe6'
        })
        this.click(() => {
            this.value = !this.value
            this.vm[this.bind] = this.value
        })
    }

    draw() {
        if (this.firstDraw) {
            this.firstDraw = false
            // 因为传入的属性值为字符串类型, 而不是布尔类型, 所以需要进一步判断
            if (this.props.value === 'true') {
                this.value = true
            } else if (this.props.value = 'false') {
                this.value = false
            }
        }
        // 边框
        this.roundedRect(this.layout.left, this.layout.top, 14, 14, 2, this.borderColor)
        // 背景
        this.context.fillStyle = this.backgroundColor
        this.context.fill()
        // 对勾
        if (this.value) {
            this.context.textBaseline = 'top'
            this.context.font = '14px sans-serif'
            this.context.fillStyle = 'white'
            this.context.fillText('✔', this.layout.left + 1, this.layout.top)
        }
        // 文字
        this.context.textBaseline = 'top'
        this.context.font = '14px sans-serif'
        this.context.fillStyle = this.labelColor
        this.context.fillText(this.props.label, this.layout.left + 24, this.layout.top)
    }
}


class ColorComponent extends Component {
    constructor(component, context) {
        super(component, context)
        this.firstDraw = true
        this.value = '#409eff'
        this.show = false
        this.registerEvent()
    }

    setBox() {
        this.style['width'] = {
            value: '40px',
        }
        this.style['height'] = {
            value: '40px',
        }
    }

    registerEvent() {
        this.click(() => {
            this.show = !this.show
        })
        this.hover(() => {
            document.body.style.cursor = 'pointer'
        })
        window.addEventListener('click', (event) => {
            if (event.clientX >= this.layout.left - 50 &&
                event.clientX <= this.layout.right + 50 &&
                event.clientY >= this.layout.bottom + 5 &&
                event.clientY <= this.layout.bottom + 145)
            {
                if (this.show) {
                    let [r, g, b] = this.context.getImageData(event.clientX, event.clientY, 1, 1).data
                    this.value = `rgb(${r}, ${g}, ${b})`
                    this.vm[this.bind] = this.value
                    this.show = false
                }
            }
        })
    }

    draw() {
        if (this.firstDraw) {
            this.firstDraw = false
            if (this.props.value !== '') {
                this.value = this.props.value
            }
        }
        // 选择按钮
        this.roundedRect(this.layout.left, this.layout.top, 40, 40, 4, '#dcdfe6')
        this.roundedRect(this.layout.left + 5, this.layout.top + 5, 30, 30, 2, '#999')
        this.context.fillStyle = this.value
        this.context.fill()
        // 箭头
        this.context.fillStyle = 'white'
        this.context.textBaseline = 'top'
        this.context.font = '14px sans-serif'
        this.context.fillText('▽', this.layout.left + 13, this.layout.top + 13)
        // 色盘
        if (this.show) {
            for (let i = 0; i < 12; i++) {
                this.context.beginPath()
                this.context.moveTo(this.layout.left + 20, this.layout.top + 115)
                this.context.arc(this.layout.left + 20, this.layout.top + 115, 70, (Math.PI * 2) / 12 * i, (Math.PI * 2) / 12 * (i + 1))
                this.context.closePath()
                this.context.fillStyle = `hsl(${i * 30}, 100%, 50%)`
                this.context.fill()
            }
        }
    }
}


class DivComponent extends Component {
    constructor(component, context) {
        super(component, context)
    }

    setBox() {
    }

    draw() {
        if (!this.style['border']) {
            return
        }
        let margin = this.style['margin'] ? parseInt(this.style['margin'].value) : 0
        let borderWidth = this.style['border'] ? parseInt(this.style['border'].value.split(' ')[0]) : 0
        let borderStyle = this.style['border'] ? this.style['border'].value.split(' ')[1] : 'solid'
        let borderColor = this.style['border'] ? this.style['border'].value.split(' ')[2] : 'black'
        let radius = this.style['border-radius'] ? parseInt(this.style['border-radius'].value) : 0

        let x = this.layout.left + margin
        let y = this.layout.top + margin
        let width = this.layout.width - margin * 2
        let height = this.layout.height - margin * 2
        this.context.lineWidth = borderWidth
        this.roundedRect(x, y, width, height, radius, borderStyle, borderColor)
        this.context.lineWidth = 1
    }
}


class ImageComponent extends Component {
    constructor(component, context) {
        super(component, context)
        this.image = null
    }

    setBox() {
        this.image = ImageLoader.images[this.props.path]
        if (this.image) {
            this.style['width'] = this.style['width'] ?? {
                value: this.image.width
            }
            this.style['height'] = this.style['height'] ?? {
                value: this.image.height
            }
        }
    }

    draw() {
        let width = parseInt(this.style['width'].value)
        let height = parseInt(this.style['height'].value)
        this.context.drawImage(this.image, this.layout.left, this.layout.top, width, height)
    }
}


class InputComponent extends Component {
    constructor(component, context) {
        super(component, context)
        this.firstDraw = true
        this.focus = false
        this.array = []
        this.index = -1
        this.selecting = false
        this.selected = { start: -1, end: -1 }
        this.borderColor = '#dcdfe6'
        this.caretColor = 'black'
        this.registerEvent()
        this.caretBlink()
    }

    get value() {
        return this.array.join('')
    }

    get selectedValue() {
        let start = Math.min(this.selected.start, this.selected.end)
        let end = Math.max(this.selected.start, this.selected.end) + 1
        return this.value.slice(start, end)
    }

    get startPosition() {
        return this.layout.left + 15
    }

    get endPosition() {
        this.context.font = '14px sans-serif'
        let width = this.context.measureText(this.value).width
        return this.startPosition + width
    }

    get caretPosition() {
        this.context.font = '14px sans-serif'
        let width = this.context.measureText(this.array.slice(0, this.index + 1).join('')).width
        return this.startPosition + width
    }

    setBox() {
        this.style['width'] = this.style['width'] ?? {
            value: '180px',
        }
        this.style['height'] = {
            value: '40px',
        }
    }

    registerEvent() {
        this.hover(() => {
            if (!this.focus) {
                this.borderColor = '#c0c4cc'
            }
            document.body.style.cursor = 'text'
        }, () => {
            if (!this.focus) {
                this.borderColor = '#dcdfe6'
            }
        })
        this.click((event) => {
            this.focus = true
            this.borderColor = '#409eff'
            // 鼠标位置插入光标
            if (event.clientX <= this.startPosition) {
                this.index = -1
            } else if (event.clientX >= this.endPosition) {
                this.index = this.value.length - 1
            } else {
                for (let i = 1; i < this.value.length; i++) {
                    let width = this.context.measureText(this.value.slice(0, i)).width
                    if (Math.abs(this.startPosition + width - event.clientX) < 7) {
                        this.index = i
                        break
                    }
                }
            }
        })
        this.dblclick(() => {
            this.selected = { start: 0, end: this.array.length - 1}
        })
        this.mousedown((event) => {
            this.selecting = true
            this.selected = { start: -1, end: -1 }
            if (event.clientX <= this.startPosition) {
                this.selected.start = 0
            } else if (event.clientX >= this.endPosition) {
                this.selected.start = this.value.length -  1
            } else {
                for (let i = 1; i < this.value.length; i++) {
                    let width = this.context.measureText(this.value.slice(0, i)).width
                    if (Math.abs(this.startPosition + width - event.clientX) < 7) {
                        this.selected.start = i
                        break
                    }
                }
            }
        })
        this.mousemove((event) => {
            if (this.selecting) {
                if (event.clientX <= this.startPosition) {
                    if (this.selected.start > 0) {
                        this.selected.end = 0
                    }
                } else if (event.clientX >= this.endPosition) {
                    if (this.selected.start < this.value.length -  1) {
                        this.selected.end = this.value.length - 1
                    }
                } else {
                    for (let i = 1; i < this.value.length; i++) {
                        let width = this.context.measureText(this.value.slice(0, i)).width
                        if (Math.abs(this.startPosition + width - event.clientX) < 7) {
                            this.selected.end = i
                            break
                        }
                    }
                }
            }
        })
        this.mouseup(() => {
            this.selecting = false
        })
        window.addEventListener('click', (event) => {
            if (!(event.clientX >= this.layout.left &&
                event.clientX <= this.layout.right &&
                event.clientY >= this.layout.top &&
                event.clientY <= this.layout.bottom))
            {
                this.focus = false
                this.borderColor = '#dcdfe6'
                this.selected = { start: -1, end: -1 }
            }
        })
        window.addEventListener('keydown', (event) => {
            if (this.focus) {
                let key = event.key
                if (key === 'Backspace') {
                    // 必须用嵌套的写法, 如果是逻辑与运算的话, 后面还有可能满足外层 if
                    if (this.value !== '') {
                        if (this.selected.start !== -1 && this.selected.end !== -1) {
                            let start = Math.min(this.selected.start, this.selected.end)
                            let end = Math.max(this.selected.start, this.selected.end)
                            this.array.splice(start, end - start + 1)
                            this.index = start - 1
                            this.selected = { start: -1, end: -1}
                        } else {
                            this.array.splice(this.index, 1)
                            this.index -= 1    
                        }
                    }
                } else if (key === 'ArrowLeft') {
                    if (this.index > -1) {
                        this.index -= 1                        
                    }
                } else if (key === 'ArrowRight') {
                    if (this.index < this.array.length - 1) {
                        this.index += 1                        
                    }
                } else if (event.metaKey) {
                    if (key === 'c') {
                        navigator.clipboard.writeText(this.selectedValue)
                    } else if (key === 'v') {
                        navigator.clipboard.readText().then((text) => {
                            if (this.selected.start !== -1 && this.selected.end !== -1) {
                                let start = Math.min(this.selected.start, this.selected.end)
                                let deleteLength = Math.abs(this.selected.start, this.selected.end)
                                // 检查所粘贴内容是否超出输入框
                                let temp = this.array.slice(0)
                                temp.splice(start, deleteLength, ...text.split(''))
                                temp = temp.join('')
                                this.context.font = '14px sans-serif'
                                let width = this.context.measureText(temp).width
                                if (width >= parseInt(this.style['width'].value) - 30) {
                                    return
                                }
                                this.array.splice(start, deleteLength, ...text.split(''))
                                this.selected = { start: -1, end: -1 }
                                this.index -= deleteLength
                                this.index += text.length
                            } else {
                                // 检查所粘贴内容是否超出输入框
                                let temp = this.array.slice(0)
                                temp.splice(this.index + 1, 0, ...text.split(''))
                                temp = temp.join('')
                                this.context.font = '14px sans-serif'
                                let width = this.context.measureText(temp).width
                                if (width >= parseInt(this.style['width'].value) - 30) {
                                    return
                                }
                                this.array.splice(this.index + 1, 0, ...text.split(''))
                                this.index += text.length    
                            }
                        })
                    } else if (key === 'x') {
                        navigator.clipboard.writeText(this.selectedValue)
                        let start = Math.min(this.selected.start, this.selected.end)
                        let end = Math.max(this.selected.start, this.selected.end)
                        this.array.splice(start, end - start + 1)
                        this.index = start - 1
                        this.selected = { start: -1, end: -1}
                    } else if (key === 'a') {
                        this.selected = { start: 0, end: this.array.length - 1}
                    }
                } else {
                    if (key === 'Enter' || key === 'Shift') {
                        return
                    }
                    this.context.font = '14px sans-serif'
                    if (this.selected.start !== -1 && this.selected.end !== -1) {
                        let start = Math.min(this.selected.start, this.selected.end)
                        let end = Math.max(this.selected.start, this.selected.end)
                        this.array.splice(start, end - start + 1, event.key)
                        this.index = start
                        this.selected = { start: -1, end: -1}
                    } else {
                        let width = this.context.measureText(this.value).width
                        if (width >= parseInt(this.style['width'].value) - 30) {
                            return
                        }
                        this.index += 1
                        this.array.splice(this.index, 0, event.key)    
                    }
                }
                this.vm[this.bind] = this.value
            }
        })
    }

    caretBlink() {
        setInterval(() => {
            if (this.focus) {
                if (this.caretColor === 'black') {
                    this.caretColor = 'white'
                } else {
                    this.caretColor = 'black'
                }
            }
        }, 700)
    }

    draw() {
        if (this.firstDraw) {
            this.firstDraw = false
            this.array = this.props.value.split('')
        }
        // 边框
        let width = parseInt(this.style['width'].value)
        let height = parseInt(this.style['height'].value)
        this.roundedRect(this.layout.left, this.layout.top, width, height, 4, this.borderColor)
        // 光标
        if (this.focus) {
            this.context.beginPath()
            this.context.moveTo(this.caretPosition, this.layout.top + 12)
            this.context.lineTo(this.caretPosition, this.layout.bottom - 12)
            this.context.strokeStyle = this.caretColor
            this.context.stroke()    
        }
        // 输入的内容
        this.context.textBaseline = 'top'
        this.context.font = '14px sans-serif'
        // 选中状态
        if (this.selected.start !== -1 && this.selected.end !== -1) {
            this.context.fillStyle = '#b2d2fd'
            let start = Math.min(this.selected.start, this.selected.end)
            let end = Math.max(this.selected.start, this.selected.end)
            start = this.startPosition + this.context.measureText(this.value.slice(0, start)).width
            end = this.startPosition + this.context.measureText(this.value.slice(0, end + 1)).width
            this.context.fillRect(start, this.layout.top, end - start, 38)    
        }
        // 文字本身
        this.context.fillStyle = '#606266'
        this.context.fillText(this.value, this.startPosition, this.layout.top + 12)
        // hint
        if (this.array.length === 0) {
            if (this.props.hint) {
                this.context.fillStyle = '#dcdfe6'
                this.context.fillText(this.props.hint, this.startPosition, this.layout.top + 12)
            }
        }
    }
}


class RadioComponent extends Component {
    constructor(component, context) {
        super(component, context)
        this.firstDraw = true
        this.checked = false
        this.borderColor = '#dcdfe6'
        this.registerEvent()
    }

    static group = {}

    setBox() {
        this.context.font = '14px sans-serif'
        let labelWidth = this.context.measureText(this.props.label).width
        this.style['width'] = {
            value: `${26 + labelWidth}px`,
        }
        this.style['height'] = {
            value: '16px',
        }
    }

    registerEvent() {
        this.click(() => {
            for (let item of RadioComponent.group[this.bind]) {
                item.checked = false
            }
            this.checked = true
            this.vm[this.bind] = this.props.option
        })
        this.hover(() => {
            this.borderColor = '#409eff'
            document.body.style.cursor = 'pointer'
        }, () => {
            this.borderColor = '#dcdfe6'
        })
    }

    draw() {
        if (this.firstDraw) {
            this.firstDraw = false
            if (this.props.value === this.props.option) {
                this.checked = true
            }
            if (RadioComponent.group[this.bind]) {
                RadioComponent.group[this.bind].push(this)
            } else {
                RadioComponent.group[this.bind] = [this]
            }
        }
        // 选择框
        this.context.beginPath()
        let x = this.layout.left + 8
        let y = this.layout.top + 8
        this.context.arc(x, y, 8, 0, 2 * Math.PI)
        this.context.fillStyle = 'white'
        this.context.fill()
        this.context.strokeStyle = this.borderColor
        this.context.stroke()
        if (this.checked) {
            this.context.beginPath()
            this.context.arc(x, y, 5, 0, 2 * Math.PI)
            this.context.strokeStyle = '#409eff'
            this.context.lineWidth = 5
            this.context.stroke()
            this.context.lineWidth = 1    
        }
        // 文字
        this.context.textBaseline = 'top'
        this.context.font = ' 14px sans-serif'
        this.context.fillStyle = '#606266'
        this.context.fillText(this.props.label, this.layout.left + 26, this.layout.top + 1)
    }
}


class SelectComponent extends Component {
    constructor(component, context) {
        super(component, context)
        this.firstDraw = true
        this.options = []
        this.selected = ''
        this.show = false
        this.optionPositions = []
        this.borderColor = '#dcdfe6'
        this.registerEvent()
    }

    setBox() {
        this.style['width'] = {
            value: '240px',
        }
        this.style['height'] = {
            value: '40px',
        }
    }

    registerEvent() {
        this.hover(() => {
            if (!this.show) {
                this.borderColor = '#c0c4cc'
            }
        }, () => {
            if (!this.show) {
                this.borderColor = '#dcdfe6'
            }
        })
        this.click(() => {
            this.borderColor = '#409eff'                
            this.show = !this.show
        })
        this.hover(() => {
            document.body.style.cursor = 'pointer'
        })
        window.addEventListener('mousemove', (event) => {
            if (this.show) {
                for (let item of this.optionPositions) {
                    if (event.clientX >= this.layout.left &&
                        event.clientX <= this.layout.right &&
                        event.clientY >= this.layout.bottom + item.top &&
                        event.clientY <= this.layout.bottom + item.bottom)
                    {
                        item.selected = true
                        document.body.style.cursor = 'pointer'
                    } else {
                        item.selected = false
                    }
                }
            }
        })
        window.addEventListener('click', (event) => {
            if (this.show) {
                for (let i = 0; i < this.optionPositions.length; i++) {
                    let item = this.optionPositions[i]
                    if (event.clientX >= this.layout.left &&
                        event.clientX <= this.layout.right &&
                        event.clientY >= this.layout.bottom + item.top &&
                        event.clientY <= this.layout.bottom + item.bottom)
                    {
                        this.selected = this.options[i]
                        this.vm[this.bind] = this.selected
                        this.show = false
                        this.borderColor = '#dcdfe6'
                    }
                }
            }
        })
    }

    draw() {
        if (this.firstDraw) {
            this.firstDraw = false
            for (let item of this.props.options) {
                if (item === this.props.value) {
                    this.selected = item
                }
            }
            this.options = this.props.options
            for (let i = 0; i < this.options.length; i++) {
                let top = 12 + i * 36 + 6
                let bottom = top + 36
                this.optionPositions.push({
                    top: top,
                    bottom: bottom,
                    selected: false,
                })
            }
        }
        // 边框
        this.roundedRect(this.layout.left, this.layout.top, 240, 40, 4, this.borderColor)
        // 箭头
        this.context.fillStyle = '#c0c4cc'
        this.context.textBaseline = 'top'
        this.context.font = '14px sans-serif'
        this.context.fillText('▽', this.layout.right - 30, this.layout.top + 12)
        if (this.show) {
            // 菜单背景
            let width = parseInt(this.style['width'].value)
            let height = this.options.length * 36 + 15
            this.roundedRect(this.layout.left, this.layout.bottom + 12, width, height, 4, '#e4e7ed')
            this.context.fillStyle = 'white'
            this.context.fill()
            this.context.fillStyle = '#e4e7ed'
            this.context.textBaseline = 'bottom'
            this.context.font = '12px sans-serif'
            this.context.fillText('△', this.layout.left + 35, this.layout.bottom + 14)
            this.context.textBaseline = 'top'
            // 菜单内容
            for (let i = 0; i < this.options.length; i++) {
                let item = this.optionPositions[i]
                if (item.selected) {
                    this.context.fillStyle = '#f5f7fa'
                    this.context.fillRect(this.layout.left, this.layout.bottom + item.top, 240, 40)
                }
                this.context.fillStyle = '#606266'
                this.context.textBaseline = 'top'
                this.context.font = '16px sans-serif'
                this.context.fillText(this.options[i], this.layout.left + 20, this.layout.bottom + item.top + 10)
            }
        }
        if (this.selected) {
            // 选定内容
            this.context.fillStyle = '#606266'
            this.context.textBaseline = 'top'
            this.context.font = '16px sans-serif'
            this.context.fillText(this.selected, this.layout.left + 16, this.layout.top + 11)    
        } else {
            // 提示文字
            this.context.fillStyle = '#b9bcc5'
            this.context.textBaseline = 'top'
            this.context.font = '16px sans-serif'
            this.context.fillText('Select', this.layout.left + 16, this.layout.top + 11)
        }
    }
}


class SliderComponent extends Component {
    constructor(component, context) {
        super(component, context)
        this.firstDraw = true,
        this.value = 0
        this.block = {
            mousedown: false,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            offsetX: 0,
        }
        this.registerEvent()
    }

    setBox() {
        this.style['width'] = this.style['width'] ?? {
            value: '300px',
        }
        this.style['height'] = {
            value: '20px',
        }
    }

    drag() {
        window.addEventListener('mousedown', (event) => {
            if (event.clientX >= this.block.left &&
                event.clientX <= this.block.right &&
                event.clientY >= this.block.top &&
                event.clientY <= this.block.bottom)
            {
                this.block.mousedown = true
                this.block.offsetX = event.clientX - this.block.left
                document.body.style.cursor = 'grabbing'
            }
        })
        window.addEventListener('mousemove', (event) => {
            if (this.block.mousedown){
                let left = event.clientX - this.block.offsetX
                if (left < this.layout.left) {
                    left = this.layout.left
                } else if (left > this.layout.right - 20) {
                    left = this.layout.right - 20
                }
                this.block.left = left
                this.block.right = this.block.left + 20
                this.value = Math.floor((this.block.left - this.layout.left) / (this.layout.right - this.layout.left - 20) * 100)
                this.vm[this.bind] = this.value
                document.body.style.cursor = 'grabbing'
            } else if (
                event.clientX >= this.block.left &&
                event.clientX <= this.block.right &&
                event.clientY >= this.block.top &&
                event.clientY <= this.block.bottom)
            {
                document.body.style.cursor = 'grab'
            }
        })
        window.addEventListener('mouseup', (event) => {
            this.block.mousedown = false
        })
    }

    registerEvent() {
        this.drag()
    }

    draw() {
        if (this.firstDraw) {
            this.firstDraw = false
            if (this.props.value) {
                this.value = Number(this.props.value)
            }
        }
        // 滑条
        let width = parseInt(this.style['width'].value) - 20
        let height = 6
        this.roundedRect(this.layout.left + 10, this.layout.top + 7, width, height, 3, '#e4e7ed')
        this.context.fillStyle = '#e4e7ed'
        this.context.fill()
        // 滑块
        this.block.left = this.layout.left + (this.layout.right - this.layout.left - 20) / 100 * this.value
        this.block.right = this.block.left + 20
        this.block.top = this.layout.top
        this.block.bottom = this.layout.bottom 
        this.context.beginPath()
        let x = this.block.left + 10
        let y = this.layout.top + 10
        this.context.arc(x, y, 10, 0, 2 * Math.PI)
        this.context.fillStyle = 'white'
        this.context.fill()
        this.context.strokeStyle = '#409eff'
        this.context.lineWidth = 2
        this.context.stroke()
        this.context.lineWidth = 1
        // 文字
        if (this.block.mousedown) {
            this.context.textBaseline = 'middle'
            this.context.textAlign = 'center'
            this.context.font = '12px sans-serif'
            this.context.fillStyle = '#409eff'
            this.context.fillText(this.value, x, y)
            this.context.textBaseline = 'top'
            this.context.textAlign = 'left'
        }
    }
}


class SwitchComponent extends Component {
    constructor(component, context) {
        super(component, context)
        this.firstDraw = true
        this.value = true
        this.registerEvent()
    }

    get backgroundColor() {
        return this.value ? '#49c45c' : '#dcdfe6'
    }

    setBox() {
        this.style['width'] = {
            value: '40px',
        }
        this.style['height'] = {
            value: '20px',
        }
    }

    registerEvent() {
        this.click(() => {
            this.value = !this.value
            this.vm[this.bind] = this.value
        })
        this.hover(() => {
            document.body.style.cursor = 'pointer'
        })
    }

    draw() {
        if (this.firstDraw) {
            this.firstDraw = false
            // 因为传入的属性值为字符串类型, 而不是布尔类型, 所以需要进一步判断
            if (this.props.value === 'true') {
                this.value = true
            } else if (this.props.value = 'false') {
                this.value = false
            }
        }
        // 背景
        this.roundedRect(this.layout.left, this.layout.top, 40, 20, 10, this.backgroundColor)
        this.context.fillStyle = this.backgroundColor
        this.context.fill()
        // 滑块
        this.context.beginPath()
        let x = this.layout.right - 10
        let y = this.layout.top + 10
        if (!this.value) {
            x = this.layout.left + 10
        }
        this.context.arc(x, y, 8, 0, 2 * Math.PI)
        this.context.fillStyle = 'white'
        this.context.fill()
    }
}


class TemplateComponent extends Component {
    constructor(component, context) {
        super(component, context)
    }

    setBox() {
    }

    draw() {
    }
}


class TextComponent extends Component {
    constructor(component, context) {
        super(component, context)
    }

    setBox() {
        this.context.font = `${this.style['font-size']?.value ?? '16px'} sans-serif`
        this.style['width'] = {
            value: this.context.measureText(this.props.content).width + 'px',
        }
        this.style['height'] = {
            value: this.style['font-size']?.value ?? '16px',
        }
    }

    draw() {
        this.context.textBaseline = 'top'
        this.context.font = `${this.style['font-size']?.value ?? '16px'} sans-serif`
        this.context.fillStyle = this.style['color']?.value ?? 'black'
        this.context.fillText(this.props.content, this.layout.left, this.layout.top)
    }
}


const ImageLoader = {
    imageNum: 0,
    loadedNum: 0,
    images: {},

    load(component) {
        for (let child of component.children) {
            if (child.tagName === 'image') {
                this.imageNum += 1
                let image = new Image()
                image.src = child.props.path
                this.images[child.props.path] = image
            }
            this.load(child)
        }
    },

    finish(callback) {
        if (Object.keys(this.images).length === 0) {
            callback()
        } else {
            for (let image of Object.values(this.images)) {
                image.onload = () => {
                    this.loadedNum += 1
                    if (this.imageNum === this.loadedNum) {
                        callback()
                    }
                }
            }
        }
    }
}


class Layouter {
    constructor(component) {
        this.component = component
        this.component.layout = {}

        this.mainSize = ''      // 'width' | 'height'
        this.mainStart = ''     // 'left' | 'right' | 'top' | 'bottom'
        this.mainEnd = ''       // 'left' | 'right' | 'top' | 'bottom'
        this.mainSign = 0       // +1 | -1
        this.mainBase = 0       // 0 | style.width | style.height

        this.crossSize = ''     // 'width' | 'height'
        this.crossStart = ''    // 'left' | 'right' | 'top' | 'bottom'
        this.crossEnd = ''      // 'left' | 'right' | 'top' | 'bottom'
        this.crossSign = 0      // +1 | -1
        this.crossBase = 0      // 0 | style.width | style.height

        this.children = []

        this.flexLines = []
    }

    layout() {
        if (!this.component.children.length) {
            return
        }
        this.flexLines = []
        this.setup(this.component)  // 设置组件的 layout 属性, 用于保存排版信息
        this.setDefaultValue()      // 对于没有显式设置的 flex 相关的属性, 设置默认值
        this.setRuler()             // 根据 flex-direction 设置相应的尺度
        this.setChildren()          // 添加子元素并按 order 排序
        this.splitLine()            // 分行
        this.computeMainAxis()      // 计算主轴
        this.computeCrossAxis()     // 计算交叉轴
        for (let child of this.component.children) {
            this.component = child
            this.layout()
        }
    }

    setup(component) {
        if (!(component instanceof DivComponent)) {
            component.layout = {
                width: component.style.width ? parseInt(component.style.width.value) : 0,
                height: component.style.height ? parseInt(component.style.height.value) : 0,
            }
        }
    }

    setDefaultValue() {
        let style = this.component.style
        style['justify-content'] = style['justify-content'] ?? { value: 'flex-start' }
        style['align-items'] = style['align-items'] ?? { value: 'stretch' }
        style['flex-direction'] = style['flex-direction'] ?? { value: 'row' }
        style['flex-wrap'] = style['flex-wrap'] ?? { value: 'nowrap' }
        style['align-content'] = style['align-content'] ?? { value: 'stretch' }
        if (style['flex-flow']) {
            style['flex-direction'] = { value: style['flex-flow'].value.split(' ')[0] }
            style['flex-wrap'] = { value: style['flex-flow'].value.split(' ')[1] }
        }
    }

    setRuler() {
        let style = this.component.style
        let layout = this.component.layout
        if (style['flex-direction'].value === 'row') {
            this.mainSize = 'width'
            this.mainStart = 'left'
            this.mainEnd = 'right'
            this.mainSign = +1
            this.mainBase = (layout.left ?? 0) + parseInt(style.margin?.value ?? 0) + parseInt(style.border?.value.split(' ')[0] ?? 0) + parseInt(style.padding?.value ?? 0)

            this.crossSize = 'height'
            this.crossStart = 'top'
            this.crossEnd = 'bottom'
            this.crossSign = +1
            this.crossBase = (layout.top ?? 0) + parseInt(style.margin?.value ?? 0) + parseInt(style.border?.value.split(' ')[0] ?? 0) + parseInt(style.padding?.value ?? 0)
        } else if (style['flex-direction'].value === 'row-reverse') {
            this.mainSize = 'width'
            this.mainStart = 'right'
            this.mainEnd = 'left'
            this.mainSign = -1
            this.mainBase = (layout.right ?? layout.width) - parseInt(style.margin?.value ?? 0) - parseInt(style.border?.value.split(' ')[0] ?? 0) - parseInt(style.padding?.value ?? 0)

            this.crossSize = 'height'
            this.crossStart = 'top'
            this.crossEnd = 'bottom'
            this.crossSign = +1
            this.crossBase = (layout.top ?? 0) + parseInt(style.margin?.value ?? 0) + parseInt(style.border?.value.split(' ')[0] ?? 0) + parseInt(style.padding?.value ?? 0)
        } else if (style['flex-direction'].value === 'column') {
            this.mainSize = 'height'
            this.mainStart = 'top'
            this.mainEnd = 'bottom'
            this.mainSign = +1
            this.mainBase = (layout.top ?? 0) + parseInt(style.margin?.value ?? 0) + parseInt(style.border?.value.split(' ')[0] ?? 0) + parseInt(style.padding?.value ?? 0)

            this.crossSize = 'width'
            this.crossStart = 'left'
            this.crossEnd = 'right'
            this.crossSign = +1
            this.crossBase = (layout.left ?? 0) + parseInt(style.margin?.value ?? 0) + parseInt(style.border?.value.split(' ')[0] ?? 0) + parseInt(style.padding?.value ?? 0)
        } else if (style['flex-direction'].value === 'column-reverse') {
            this.mainSize = 'height'
            this.mainStart = 'bottom'
            this.mainEnd = 'top'
            this.mainSign = -1
            this.mainBase = (layout.bottom ?? layout.height) - parseInt(style.margin?.value ?? 0) - parseInt(style.border?.value.split(' ')[0] ?? 0) - parseInt(style.padding?.value ?? 0) 

            this.crossSize = 'width'
            this.crossStart = 'left'
            this.crossEnd = 'right'
            this.crossSign = +1
            this.crossBase = (layout.left ?? 0) + parseInt(style.margin?.value ?? 0) + parseInt(style.border?.value.split(' ')[0] ?? 0) + parseInt(style.padding?.value ?? 0)
        }

        if (style['flex-wrap'].value === 'wrap-reverse') {
            [this.crossStart, this.crossEnd] = [this.crossEnd, this.crossStart]
            this.crossSign = -1
            this.crossBase = {
                'row': (layout.bottom ?? layout.height) - parseInt(style.margin?.value ?? 0) - parseInt(style.border?.value.split(' ')[0] ?? 0) - parseInt(style.padding?.value ?? 0),
                'row-reverse': (layout.bottom ?? layout.height) - parseInt(style.margin?.value ?? 0) - parseInt(style.border?.value.split(' ')[0] ?? 0) - parseInt(style.padding?.value ?? 0),
                'column': (layout.right ?? layout.width) - parseInt(style.margin?.value ?? 0) - parseInt(style.border?.value.split(' ')[0] ?? 0) - parseInt(style.padding?.value ?? 0),
                'column-reverse': (layout.right ?? layout.width) - parseInt(style.margin?.value ?? 0) - parseInt(style.border?.value.split(' ')[0] ?? 0) - parseInt(style.padding?.value ?? 0),
            }[style['flex-direction'].value]
        }
    }

    setChildren() {
        let children = []
        for (let child of this.component.children) {
            this.setup(child)
            children.push(child)
            if (child.children.length > 0) {
                // child 为 DivComponent, 因为只有 div 有子节点, 且只能嵌套一层
                child.layout.width = parseInt(child.style.width?.value ?? 0)
                if (!child.style.width) {
                    for (let c of child.children) {
                        c.setBox()
                        child.layout.width += parseInt(c.style.width.value)
                    }
                    child.layout.width +=
                        parseInt(child.style.padding?.value ?? 0) * 2 +
                        parseInt(child.style.border?.value.split(' ')[0] ?? 0) * 2 +
                        parseInt(child.style.margin?.value ?? 0) * 2
                } else {
                    child.layout.width += parseInt(child.style.margin?.value ?? 0) * 2
                }
                child.layout.height = parseInt(child.style.height?.value ?? 0)
                if (!child.style.height) {
                    for (let c of child.children) {
                        c.setBox()
                        child.layout.height = Math.max(parseInt(c.style.height.value), child.layout.height)
                    }
                    child.layout.height +=
                        parseInt(child.style.padding?.value ?? 0) * 2 +
                        parseInt(child.style.border?.value.split(' ')[0] ?? 0) * 2 +
                        parseInt(child.style.margin?.value ?? 0) * 2
                } else {
                    child.layout.height += parseInt(child.style.margin?.value ?? 0) * 2
                }
            }
        }
        children.sort((a, b) => {
            return (a.style.order?.value ?? 0) - (b.style.order?.value ?? 0)
        })
        this.children = children
    }

    createLine() {
        let newLine = []
        let margin = parseInt(this.component.style.margin?.value ?? 0)
        let border = parseInt(this.component.style.border?.value.split(' ')[0] ?? 0)
        let padding = parseInt(this.component.style.padding?.value ?? 0)
        newLine.mainSpace = this.component.layout[this.mainSize] - margin * 2 - border * 2 - padding * 2
        newLine.crossSpace = 0
        this.flexLines.push(newLine)
        return newLine
    }

    splitLine() {
        let newLine = this.createLine()
        let style = this.component.style
        let layout = this.component.layout
        for (let child of this.children) {
            let childStyle = child.style
            let childLayout = child.layout
            if (childStyle['flex']) {
                // flex 属性意味着可伸缩, 无论剩余多少尺寸都能放进去
                newLine.push(child)
                newLine.crossSpace = Math.max(newLine.crossSpace, childLayout[this.crossSize])
            } else if (style['flex-wrap'].value === 'no-wrap') {
                // 强行在一行中塞入全部元素
                newLine.push(child)
                newLine.mainSpace -= childLayout[this.mainSize]
                newLine.crossSpace = Math.max(newLine.crossSpace, childLayout[this.crossSize])
            } else {
                // 如果元素超过容器, 则压缩到容器大小
                let containerWidth = layout[this.mainSize] - parseInt(style.margin?.value ?? 0) * 2 - parseInt(style.border?.value.split(' ')[0] ?? 0) * 2 - parseInt(style.padding?.value ?? 0) * 2
                childLayout[this.mainSize] = Math.min(childLayout[this.mainSize], containerWidth)
                // 分行
                if (newLine.mainSpace < childLayout[this.mainSize]) {
                    newLine = this.createLine()
                }
                // 将元素收入行内
                newLine.push(child)
                newLine.mainSpace -= childLayout[this.mainSize]
                newLine.crossSpace = Math.max(newLine.crossSpace, childLayout[this.crossSize])
            }
        }
    }

    computeFlexLine(line, flexTotal) {
        let currentMain = this.mainBase
        for (let child of line) {
            if (child.style['flex']) {
                child.layout[this.mainSize] = child.style['flex'].value / flexTotal * line.mainSpace
            }
            child.layout[this.mainStart] = currentMain
            child.layout[this.mainEnd] = currentMain + this.mainSign * child.layout[this.mainSize]
            currentMain = child.layout[this.mainEnd]
        }
    }

    computeNotFlexLine(line) {
        let style = this.component.style
        let currentMain = this.mainBase
        let space = 0
        if (style['justify-content'].value === 'flex-start') {
            currentMain = this.mainBase
            space = 0
        } else if (style['justify-content'].value === 'flex-end') {
            currentMain = this.mainBase + this.mainSign * line.mainSpace
            space = 0
        } else if (style['justify-content'].value === 'center') {
            currentMain = this.mainBase + this.mainSign * line.mainSpace / 2
            space = 0
        } else if (style['justify-content'].value === 'space-between') {
            currentMain = this.mainBase
            space = this.mainSign * line.mainSpace / (line.length - 1)
        } else if (style['justify-content'].value === 'space-around') {
            currentMain = this.mainBase + this.mainSign * line.mainSpace / line.length / 2
            space = this.mainSign * line.mainSpace / line.length
        }
        for (let child of line) {
            let childLayout = child.layout
            childLayout[this.mainStart] = currentMain
            childLayout[this.mainEnd] = currentMain + this.mainSign * childLayout[this.mainSize]
            currentMain = childLayout[this.mainEnd] + space
        }
    }

    computeNegativeSpaceLine(line) {
        let layout = this.component.layout
        let scale = layout[this.mainSize] / (layout[this.mainSize] + (-line.mainSpace))
        let currentMain = this.mainBase
        for (let child of line) {
            let childLayout = child.layout
            if (child.style['flex']) {
                // 将有 flex 属性的元素压缩到 0
                childLayout[this.mainSize] = 0
            }
            childLayout[this.mainSize] *= scale
            childLayout[this.mainStart] = currentMain
            childLayout[this.mainEnd] = currentMain + this.mainSign * childLayout[this.mainSize]
            currentMain = childLayout[this.mainEnd]
        }
    }

    computeMainAxis() {
        for (let line of this.flexLines) {
            if (line.mainSpace >= 0) {
                let flexTotal = 0
                for (let child of line) {
                    flexTotal += child.style['flex']?.value ?? 0
                }
                if (flexTotal > 0) {
                    // 含有 [有 flex 属性的元素] 的行
                    this.computeFlexLine(line, flexTotal)
                } else {
                    // 没有 [有 flex 属性的元素] 的行
                    this.computeNotFlexLine(line)
                }
            } else {
                // 剩余空间为负, 说明 [flex-wrap: nowrap], 等比压缩不含有 flex 元素的属性
                this.computeNegativeSpaceLine(line)
            }
        }
    }

    computeCrossAxis() {
        // 根据 align-content align-items align-self 确定元素位置
        let style = this.component.style
        let layout = this.component.layout
        // 自动撑开交叉轴
        layout[this.crossSize] === 0
        if (layout[this.crossSize] === 0) {
            for (let line of this.flexLines) {
                layout[this.crossSize] += line.crossSpace
            }
            layout[this.crossSize] += parseInt(style.padding?.value ?? 0) + parseInt(style.border?.value.split(' ')[0] ?? 0)
        }
        // 计算交叉轴总空白
        let crossSpaceTotal = layout[this.crossSize] - parseInt(style.margin?.value ?? 0) * 2 - parseInt(style.border?.value.split(' ')[0] ?? 0) * 2 - parseInt(style.padding?.value ?? 0) * 2
        for (let line of this.flexLines) {
            crossSpaceTotal -= line.crossSpace
        }
        // 确定每一条主轴位于整个容器的交叉轴的位置
        let currentCross = this.crossBase
        let space = 0
        if (style['align-content'].value === 'flex-start') {
            currentCross = this.crossBase
            space = 0
        } else if (style['align-content'].value === 'flex-end') {
            currentCross = this.crossBase + this.crossSign * crossSpaceTotal
            space = 0
        } else if (style['align-content'].value === 'center') {
            currentCross = this.crossBase + this.crossSign * crossSpaceTotal / 2
            space = 0
        } else if (style['align-content'].value === 'space-between') {
            currentCross = this.crossBase
            space = this.crossSign * crossSpaceTotal / (this.flexLines.length - 1)
        } else if (style['align-content'].value === 'space-around') {
            currentCross = this.crossBase + this.crossSign * crossSpaceTotal / this.flexLines.length / 2
            space = this.crossSign * crossSpaceTotal / this.flexLines.length
        } else if (style['align-content'].value === 'stretch') {
            currentCross = this.crossBase
            space = 0
        }
        // 确定每个元素的具体位置
        for (let line of this.flexLines) {
            let lineCrossSize = line.crossSpace
            if (style['align-content'].value === 'stretch') {
                // 平分剩余的空白空间, 拉伸填满
                lineCrossSize = line.crossSpace + crossSpaceTotal / this.flexLines.length
            }
            for (let child of line) {
                let childLayout = child.layout
                let align = child.style['align-self']?.value || style['align-items'].value
                if (align === 'stretch') {
                    childLayout[this.crossStart] = currentCross
                    childLayout[this.crossSize] = childLayout[this.crossSize] ?? lineCrossSize
                    childLayout[this.crossEnd] = childLayout[this.crossStart] + this.crossSign * childLayout[this.crossSize]
                } else if (align === 'flex-start') {
                    childLayout[this.crossStart] = currentCross
                    childLayout[this.crossEnd] = childLayout[this.crossStart] + this.crossSign * childLayout[this.crossSize]
                } else if (align === 'flex-end') {
                    childLayout[this.crossStart] = currentCross + this.crossSign * lineCrossSize - this.crossSign * childLayout[this.crossSize]
                    childLayout[this.crossEnd] = childLayout[this.crossStart] + this.crossSign * childLayout[this.crossSize]
                } else if (align === 'center') {
                    childLayout[this.crossStart] = currentCross + this.crossSign * (lineCrossSize - childLayout[this.crossSize]) / 2
                    childLayout[this.crossEnd] = childLayout[this.crossStart] + this.crossSign * childLayout[this.crossSize]
                }
            }
            currentCross += this.crossSign * lineCrossSize + space
        }
    }
}


function main() {
    let { style, template, script } = components.main
    new StyleBinder(template, style).bind()
    let canvas = new Canvas()
    let component = new TemplateParser(template, canvas.context).parse()
    component.style['width'] = { value: canvas.canvas.width }
    component.style['height'] = { value: canvas.canvas.height }
    new Mvvm(component, script, () => {
        // 在属性发生改变的时候重排
        new Layouter(component).layout()
    })
    ImageLoader.load(template)
    ImageLoader.finish(() => {
        canvas.launch(component, () => {
            // 在窗口大小改变的时候重排
            new Layouter(component).layout()
        })
    })
}


class Mvvm {
    constructor(component, config, reLayout) {
        this.component = component
        this.reLayout = reLayout
        this.proxyCallbackMap = new Map()
        this.currentProxyCallback = null
        // data
        this.vm = this.proxy(config.data)
        // methods
        for (let name in config.methods) {
            this.vm[name] = (new Function(config.methods[name].replace(`${name}()`, ''))).bind(this.vm)
        }
        this.traverse(this.component)
        this.reLayout()
    }

    proxy(object) {
        let self = this
        return new Proxy(object, {
            get(object, property) {
                if (typeof object[property] === 'object' && !Array.isArray(object[property])) {
                    return self.proxy(object[property])
                } else {
                    if (self.currentProxyCallback) {
                        if (!self.proxyCallbackMap.has(object)) {
                            self.proxyCallbackMap.set(object, new Map())
                        }
                        if (!self.proxyCallbackMap.get(object).has(property)) {
                            self.proxyCallbackMap.get(object).set(property, new Set())
                        }
                        self.proxyCallbackMap.get(object).get(property).add(self.currentProxyCallback)
                    }
                    return object[property]
                }
            },
            set(object, property, value) {
                object[property] = value
                let callbacks = self.proxyCallbackMap.get(object)?.get(property) ?? (new Set())
                for (let callback of callbacks) {
                    callback()
                }
                return true
            }
        })
    }

    registerProxyCallback(callback) {
        this.currentProxyCallback = callback
        callback()
        this.currentProxyCallback = null
    }

    traverse(component) {
        for (let [prop, value] of Object.entries(component.props)) {
            if (value.match(/{([\s\S]+)}/)) {
                let name = RegExp.$1.trim()
                this.registerProxyCallback(() => {
                    if (typeof this.vm[name] === 'function' || Array.isArray(this.vm[name])) {
                        component.props[prop] = this.vm[name]
                    } else {
                        component.props[prop] = value.replace(/{([\s\S]+)}/, this.vm[name])
                        if (prop === 'value') {
                            component.bind = name
                        }
                    }
                    component.setBox()
                    this.reLayout()
                })
            }
        }
        component.vm = this.vm
        component.setBox()
        for (let child of component.children) {
            this.traverse(child)
        }
    }
}


class StyleBinder {
    constructor(template, style) {
        this.template = template
        this.style = style
    }

    bind() {
        this.traverse(this.template)
    }

    match(component, selector) {
        if (selector[0] === '#') {
            let id = component.props.id
            if (id === selector.slice(1)) {
                return true
            }
        } else if (selector[0] === '.') {
            let classNames = component.props.class?.split(' ') ?? []
            for (let className of classNames) {
                if (className === selector.slice(1)) {
                    return true
                }
            }
        } else if (selector === component.tagName) {
            return true
        } else {
            return false
        }
    }

    specificity(selectors) {
        let s = [0, 0, 0, 0]
        for (let part of selectors) {
            if (part[0] === '#') {
                s[1] += 1
            } else if (part[0] === '.') {
                s[2] += 1
            } else {
                s[3] += 1
            }
        }
        return s
    }

    compare(s1, s2) {
        if (s1[0] !== s2[0]) {
            return s1[0] > s2[0]
        } else if (s1[1] !== s2[1]) {
            return s1[1] > s2[1]
        } else if (s1[2] !== s2[2]) {
            return s1[2] > s2[2]
        } else if (s1[3] !== s2[3]) {
            return s1[3] - s2[3]
        } else {
            return false
        }
    }

    compute(component) {
        ruleLoop:
        for (let rule of this.style) {
            let selectors = rule.selector.split(' ').reverse()
            let parent = component
            for (let part of selectors) {
                if (this.match(parent, part)) {
                    parent = parent.parent
                } else {
                    continue ruleLoop
                }
            }
            let specificity = this.specificity(selectors)
            let style = component.style
            for (let [property, value] of Object.entries(rule.declaration)) {
                style[property] = style[property] ?? {}
                style[property].specificity = style[property].specificity ?? specificity
                if (this.compare(style[property].specificity, specificity)) {
                    // 如果原样式比新样式的优先级更高, 则无需改变
                    continue
                }
                // 后来优先原则
                style[property].value = value
            }
        }
    }

    traverse(component) {
        this.compute(component)
        for (let child of component.children) {
            this.traverse(child)
        }
    }
}


class TemplateParser {
    constructor(template, context) {
        this.template = template
        this.context = context
    }

    parse() {
        return this.traverse(this.template)
    }

    traverse(component) {
        let componentObj = new ({
            button: ButtonComponent,
            checkbox: CheckboxComponent,
            color: ColorComponent,
            div: DivComponent,
            image: ImageComponent,
            input: InputComponent,
            radio: RadioComponent,
            select: SelectComponent,
            slider: SliderComponent,
            switch: SwitchComponent,
            template: TemplateComponent,
            text: TextComponent,
        }[component.tagName])(component, this.context)
        for (let child of component.children) {
            componentObj.children.push(this.traverse(child))
        }
        return componentObj
    }
}


