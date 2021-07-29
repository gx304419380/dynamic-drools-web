<template>
  <div class="common-body">
    <el-form :inline="true" :model="condition">
      <el-form-item label="规则名称">
        <el-input v-model="condition.name" placeholder="接口名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchApi">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-plus" @click="addApi">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="tableData"
        stripe
        :height="dynamicHeight"
        style="width: 100%">
      <el-table-column
          prop="id"
          label="ID"
          width="180">
      </el-table-column>
      <el-table-column
          prop="name"
          label="名称"
          width="180">
      </el-table-column>
      <el-table-column
          prop="createTime"
          :formatter="formatDate"
          label="创建时间"
          width="180">
      </el-table-column>
      <el-table-column
          prop="description"
          min-width="200"
          header-align="center"
          show-overflow-tooltip
          label="备注">
      </el-table-column>
      <el-table-column
          fixed="right"
          header-align="center"
          label="操作"
          width="100">
        <template #default="scope">
          <el-button @click="apiDetail(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small" @click="deleteApi(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        class="page-class"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-model:currentPage="condition.pageNo"
        :page-sizes="[10, 20, 50]"
        :page-size="condition.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </div>
</template>

<script>
import * as RuleApi from '@/api/RuleApi'

export default {
  name: "Home",
  data() {
    return {
      dynamicHeight: document.documentElement.clientHeight-200,
      total: 0,
      tableData: [],
      condition: {
        name: '',
        pageNo: 1,
        pageSize: 20
      }
    }
  },
  methods: {
    searchApi() {
      RuleApi.getRulePage(this.condition).then(res => {
        this.tableData = res.data.data.content;
        this.total = res.data.data.totalElements;
      })
    },
    addApi() {
      this.$router.push("/apiDetail")
    },
    apiDetail(row) {
      this.$router.push({path: '/apiDetail', query: {id: row.id}})
    },
    deleteApi(row) {
      this.$confirm('确认删除该规则?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        RuleApi.deleteRule(row.id).then(res => {
          console.log(res)
          this.$message.success('删除成功')
          this.searchApi()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSizeChange(pageSize) {
      this.condition.pageSize = pageSize
      this.searchApi();
    },
    handleCurrentChange() {
      this.searchApi();
    },
    getHeight() {
      //获取浏览器高度并计算得到表格所用高度。
      this.dynamicHeight=document.documentElement.clientHeight-200
    },
    formatDate(row, column, cellValue) {
      return cellValue ? cellValue.replace("T", " ") : cellValue;
    }
  },
  mounted() {
    this.searchApi()
    this.getHeight()
    //增加监听事件，窗口变化时得到高度。
    window.addEventListener('resize',this.getHeight,false);
  }
}
</script>

<style scoped>
.common-body {
  /*margin: 15px 10px;*/
  width: 100%;
}
.page-class {
  margin-top: 10px;
  text-align: right;
}
</style>
