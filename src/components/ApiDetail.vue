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
              <el-option key="1" label="dracula" value="ace/theme/dracula"/>
              <el-option key="2" label="clouds" value='ace/theme/clouds'/>
            </el-select>
          </el-form-item>
          <el-form-item class="editor-header-input">
            <span style="color: white">启用编辑: &nbsp;&nbsp;&nbsp;</span>
            <el-switch v-model="canEdit" @change="changeEdit"/>
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
    <el-drawer
        size="40%"
        :title="'测试接口 ['+rule.name+']'"
        v-model="testDrawer"
        direction="rtl"
        @opened="loadTestFormEditor"
    >
      <div class="drawer-form">
        <el-form :model="testForm" label-width="60px" v-loading="testFormLoading">
          <el-form-item label="方法">
            <el-select v-model="testForm.method" placeholder="请选择">
              <el-option label="POST" value="post"></el-option>
              <el-option label="GET" value="get"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="url">
            <el-input disabled v-model="testForm.url" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="参数">
            <div ref="testFormAce"></div>
          </el-form-item>
          <el-form-item label="返回值">
            <el-input type="textarea" :rows="5" placeholder="返回值" v-model="testForm.response" />
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button type="primary" @click="testApi">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import ace from 'ace-builds'
import * as RuleApi from '@/api/RuleApi'
import axios from "axios";
/**
 * 如果要引入其他语言模式，在这里加上对应的js包
 *  import 'ace-builds/src-min-noconflict/mode-java'
 */
import 'ace-builds/src-min-noconflict/mode-drools'
import 'ace-builds/src-min-noconflict/mode-json'
import 'ace-builds/src-min-noconflict/theme-dracula'
import 'ace-builds/src-min-noconflict/theme-clouds'


export default {
  name: "ApiDetail",
  components: {},
  data() {
    return {
      id: this.$route.query.id,
      editor: null,
      testFormEditor: null,
      theme: 'ace/theme/dracula',
      canEdit: false,
      isEdit: false,
      saveLoading: false,
      initLoading: false,
      testFormLoading: false,
      testDrawer: false,
      rule: {
        name: null,
        id: null,
        description: null,
        ruleText: null
      },
      testForm: {
        id: null,
        url: '',
        method: 'POST',
        param: {},
        response: ''
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
      if (!this.rule.id) {
        this.$message.error("请先保存规则")
        return
      }

      this.testForm.id = this.rule.id
      this.testForm.url = '/rule/dynamic/' + this.rule.id
      this.testForm.method = 'POST'
      this.testDrawer = true
    },
    loadTestFormEditor() {
      this.testFormEditor = ace.edit(this.$refs.testFormAce, {
        maxLines: 10, // 最大行数，超过会自动出现滚动条
        minLines: 5, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
        fontSize: 16, // 编辑器内字体大小
        theme: 'ace/theme/clouds', // 默认设置的主题
        mode: 'ace/mode/json', // 默认设置的语言模式
        tabSize: 4, // 制表符设置为 4 个空格大小
        readOnly: false,
        highlightActiveLine: true,
        value: '{\n}\n\n\n\n'
      })
    },
    goBack() {
      this.$router.go(-1)
    },
    testApi() {
      let value = this.testFormEditor.getValue();

      let param;
      try {
        param = JSON.parse(value);
        if (!(typeof param == 'object' && param)) {
          this.$message.error("请检查json格式是否正确")
          return;
        }
      } catch (e) {
        this.$message.error("请检查json格式是否正确")
        return;
      }

      let request = {
        url: this.testForm.url,
        method: this.testForm.method
      }

      if (this.testForm.method === 'get') {
        request.params = param
      } else {
        request.data = param
      }

      this.testFormLoading = true;
      console.log('request', request)
      axios(request).then(res => {
        this.testForm.response = JSON.stringify(res.data, null, '    ')
      }).finally(() => {
        this.testFormLoading = false
      })
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

    //如果是修改操作
    if (this.$route.query.id) {
      this.initLoading = true
      this.getDetail();
      this.isEdit = true;
      this.initLoading = false
    }
    //新增一个规则
    else {
      this.canEdit = true;
      this.editor.setReadOnly(false);
      this.editor.setValue(RuleApi.defaultRule());
    }
  }
}
</script>

<style scoped>
.common-div {
  width: 100%;
}

.editor-header {
  text-align: right;
  border: 1px #ccc !important;
  border-radius: 5px 5px 0 0;
  background-color: #282a36;
}

.el-form-item--mini.el-form-item.editor-header-input {
  margin-bottom: 5px;
}

.drawer-form {
  padding: 20px;
}
</style>
