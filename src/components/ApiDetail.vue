<template>
  <div class="common-div">
    <el-form label-width="60px" :model="rule">
      <el-form-item label="ID">
        <el-input v-model="rule.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="rule.name" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="rule.description" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="代码">
        <el-form :inline="true" size="mini" class="editor-header">
          <el-form-item class="editor-header-input">
            <span style="color: white">主题: &nbsp;&nbsp;&nbsp;</span>
            <el-select v-model="theme" placeholder="请选择" @change="changeTheme" size="mini">
              <el-option key="1" label="dracula" value="ace/theme/dracula" />
              <el-option key="2" label="clouds" value='ace/theme/clouds' />
              <el-option key="3" label="eclipse" value='ace/theme/eclipse' />
              <el-option key="4" label="github" value='ace/theme/github' />
            </el-select>
          </el-form-item>
          <el-form-item class="editor-header-input">
            <span style="color: white">启用编辑: &nbsp;&nbsp;&nbsp;</span>
            <el-switch v-model="canEdit" @change="changeEdit" />
          </el-form-item>
        </el-form>
        <div ref="ace"></div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import ace from 'ace-builds'
// import 'ace-builds/src-min-noconflict/mode-java'
import 'ace-builds/src-min-noconflict/mode-drools'
import 'ace-builds/src-min-noconflict/theme-dracula'
import 'ace-builds/src-min-noconflict/theme-clouds'
import 'ace-builds/src-min-noconflict/theme-eclipse'
import 'ace-builds/src-min-noconflict/theme-github'

export default {
  name: "ApiDetail",
  components: {
  },
  data() {
    return {
      id: this.$route.query.id,
      editor: null,
      theme: 'ace/theme/dracula',
      canEdit: false,
      rule: {
        name: null,
        id: null,
        description: null,
        ruleText: null
      }
    }
  },
  methods: {
    getDetail() {
      let id = this.$route.query.id
      axios.get('/rule/' + id)
          .then(res => {
            if (res.data.code === 0) {
              this.rule = res.data.data;
              this.editor.setValue(this.rule.ruleText)
            } else {
              this.$message.error('查询失败：' + res.data.message)
            }
          })
    },
    changeTheme(val) {
      this.editor.setTheme(val)
    },
    changeEdit(val) {
      this.editor.setReadOnly(!val)
    }
  },
  mounted() {
    this.editor = ace.edit(this.$refs.ace, {
      maxLines: 25, // 最大行数，超过会自动出现滚动条
      minLines: 10, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
      fontSize: 16, // 编辑器内字体大小
      theme: 'ace/theme/dracula', // 默认设置的主题
      mode: 'ace/mode/drools', // 默认设置的语言模式
      tabSize: 4, // 制表符设置为 4 个空格大小
      readOnly: true,
      highlightActiveLine: true,
      value: ''
    })

    this.getDetail();
  }
}
</script>

<style scoped>
.common-div {
  width: 100%;
}

.editor-header {
  text-align: right;
  border: 1px #ccc!important;
  border-radius: 5px 5px 0 0;
  background-color: #282a36;
}
.el-form-item--mini.el-form-item.editor-header-input {
  margin-bottom: 5px;
}
</style>
