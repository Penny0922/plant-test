<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="currentPath"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <!-- 一级菜单 -->

      <el-submenu v-for="item in menuItems" :key="item.id" :index="item.id">
        <template #title>
          <span>{{ item.authName }}</span>
        </template>

        <!-- 二级菜单-->
        <el-menu-item
          v-for="subItem in item.children"
          :key="subItem.id"
          :index="'/' + subItem.path"
        >
          <template #title>
            {{ subItem.authName }}
          </template>
        </el-menu-item>
      </el-submenu>

      <!-- 一级菜单 -->
    </el-menu>
  </div>
</template>

<script>
import { reactive, onMounted, computed, toRefs } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

export default {
  /* setup() {
    const route = useRoute();
    const store = useStore();

    const currentPath = computed(() => {
      return route.path;
    });
    const collapse = computed(() => {
      return store.state.system.collapse;
    });
    

    // 获取当前用户权限菜单等（暂时放在组件内获取，不然刷新页面菜单会消失）
    const getPermissionMenu = async () => {
      console.log(JSON.parse(sessionStorage["userInfo"]).data.data.token);
      // 动态获取菜单接口入参一般为token或者userId，因为采用mock模拟返回所以临时使用nickName作为角色入参，实际开发可根据接口差异修改入参
      let par = {
        token: JSON.parse(sessionStorage["userInfo"]).data.data.token,
      };
      const res = await store.dispatch("user/getPermissionMenu", par);
      if (res) {
        console.log("接口返回的菜单为：", res);
      }
    };

    return {
      currentPath,
      collapse,
    };
  }, */

  // 2.0语法注释
  data() {
    return {
      menuItems: [],
    };
  },
  computed: {
    currentPath() {
      return this.$route.path;
    },
    collapse() {
      return this.$store.state.system.collapse;
    },
  },
  mounted() {
    // 用户每次刷新页面都会重新获取一遍菜单，防止store中的数据丢失
    this.getPermissionMenu();
  },
  methods: {
    // 获取当前用户权限菜单等（暂时放在组件内获取，不然刷新页面菜单会消失）
    async getPermissionMenu() {
      // 动态获取菜单接口入参一般为token或者userId，因为采用mock模拟返回所以临时使用nickName作为角色入参，实际开发可根据接口差异修改入参
      let par = {
        token: JSON.parse(sessionStorage["userInfo"]).data.data.token,
      };
      const { data: res } = await this.$store.dispatch(
        "user/getPermissionMenu",
        par
      );
      if (res) {
        console.log("接口返回的菜单数组为：", res);
        this.menuItems = res.data;
      }
      console.log(this.menuItems);
    },
  },
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
