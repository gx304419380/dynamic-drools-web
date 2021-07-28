<template>
  <div class="common-div">
    <el-page-header @back="goBack" content="规则详情"></el-page-header>
    <el-divider></el-divider>
    <el-form label-width="60px" :model="rule" v-loading="initLoading">
      <el-form-item label="ID" v-if="isEdit">
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
          <el-form-item class="editor-header-input">
            <el-button
                type="primary"
                @click="onSubmit"
                size="mini"
                round
                v-loading.fullscreen.lock="saveLoading">
              保存
            </el-button>
            <el-button
                type="danger"
                @click="onTest"
                size="mini"
                round
                v-loading.fullscreen.lock="saveLoading">
              测试
            </el-button>
          </el-form-item>
        </el-form>
        <div ref="ace"></div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ace from 'ace-builds'
import * as RuleApi from '@/api/RuleApi'
/**
 * 如果要引入其他语言模式，在这里加上对应的js包
 *  import 'ace-builds/src-min-noconflict/mode-java'
 */
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
      isEdit: false,
      saveLoading: false,
      initLoading: true,
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
      RuleApi.getRule(id).then(res => {
        this.rule = res.data.data;
        this.editor.setValue(this.rule.ruleText)
      })
    },
    changeTheme(val) {
      this.editor.setTheme(val)
    },
    changeEdit(val) {
      this.editor.setReadOnly(!val)
    },
    onEditorChange() {
      this.rule.ruleText = this.editor.getValue();
    },
    onSubmit() {
      this.saveLoading = true
      RuleApi.saveRule(this.rule).then(res => {
        this.rule.id = res.data.data
        this.isEdit = true
        this.$message.success("保存成功")
      }).finally(() => {
        this.saveLoading = false
      })
    },
    onTest() {
      console.log('test')
    },
    goBack() {
      this.$router.go(-1)
    }
  },
  mounted() {
    this.editor = ace.edit(this.$refs.ace, {
      maxLines: 25, // 最大行数，超过会自动出现滚动条
      minLines: 25, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
      fontSize: 16, // 编辑器内字体大小
      theme: 'ace/theme/dracula', // 默认设置的主题
      mode: 'ace/mode/drools', // 默认设置的语言模式
      tabSize: 4, // 制表符设置为 4 个空格大小
      readOnly: true,
      highlightActiveLine: true,
      value: ''
    })

    this.editor.on('change', this.onEditorChange)

    if (this.$route.query.id) {
      this.getDetail();
      this.isEdit = true;
    } else {
      this.canEdit = true;
      this.editor.setReadOnly(false)
    }
    this.initLoading = false
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
