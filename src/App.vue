<template>
  <div class="globalDiv">
    <el-container class="globalContainer">
      <el-header class="header">
        <span style="color: lime; font-size: 30px">Dynamic </span>
        <span style="font-size: 30px">Drools</span>
      </el-header>
      <el-container class="router-container">
          <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      activeIndex: 'api'
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style scoped>
.globalDiv {
  width: 100%;
  height: 100%;
}
.header {
  color: #fff;
  background-color: #545c64;
  line-height: 60px;
  font-size: 20px;
  padding: 0 0;
  text-align: center;
}

.globalContainer {
  width: 100%;
  height: 100%;
}

.router-container {
  padding: 15px 10px;
}

</style>
