import Vue from 'vue'
// 对饿了么组件的各个模块进行按需导入

import {
  DatePicker,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Dialog,
  Menu,
  Submenu,
  MenuItem,
  Input,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  Form,
  FormItem,
  Tag,
  Icon,
  Upload,
  Card,
  Container,
  Header,
  Aside,
  Main,
  MessageBox,
  Message,
  Tabs,
  TabPane
} from 'element-ui'
// 注册组件 样式: Vue.use(xx) Vue.use(yy)
Vue.use(DatePicker)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Checkbox)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tag)
Vue.use(Icon)
Vue.use(Upload)
Vue.use(Card)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Tabs)
Vue.use(TabPane)
// 注册事件方法样式: Vue.prototype.xx=xx
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
