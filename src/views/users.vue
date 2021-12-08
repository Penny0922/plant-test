<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades" /> 基础表格
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button
          type="primary"
          icon="el-icon-delete"
          class="handle-del mr10"
          @click="delAllSelection"
        >
          批量删除
        </el-button>
        <el-select
          v-model="query.address"
          placeholder="地址"
          class="handle-select mr10"
        >
          <el-option key="1" label="广东省" value="广东省" />
          <el-option key="2" label="湖南省" value="湖南省" />
        </el-select>
        <el-input
          v-model="query.name"
          placeholder="用户名"
          class="handle-input mr10"
        />
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">
          搜索
        </el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        class="table"
        header-cell-class-name="table-header"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="index" label="ID" width="55" align="center" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              class="el-icon-edit"
            >
            </el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              class="el-icon-delete"
              @click="removeUserById(scope.row.id)"
            >
            </el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                size="mini"
                class="el-icon-setting"
                @click="setRole(scope.row)"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageIndex"
          :page-size="query.pageSize"
          :total="pageTotal"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog v-model="editVisible" title="编辑" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getTableData } from "@/api/index";
export default {
  name: "Users",
  title: "用户表格",
  data() {
    return {
      query: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 10,
      },
      tableData: [],
      multipleSelection: [],
      delList: [],
      editVisible: false,
      pageTotal: 0,
      form: {},
      idx: -1,
      id: -1,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 获取表格数据
    async getData() {
      console.log("这一步！！！");
      const res = await getTableData(this.query);

      this.tableData = res.data.data.users;
      console.log("接口返回用户数据为：", this.tableData);
      this.pageTotal = res.pageTotal || 50;
      /* getTableData(this.query).then(res => {
                console.log('接口返回数据为：', res);
                this.tableData = res.list;
                this.pageTotal = res.pageTotal || 50;
            }); */
    },
    // 触发搜索按钮
    handleSearch() {
      // this.$set(this.query, 'pageIndex', 1); // this.$set在3.0已废弃。用 proxy 实现双向绑定不会出现不更新的问题
      this.query.pageIndex = 1;
      this.getData();
    },
    // 删除操作
    handleDelete(index) {
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          this.$message.success("删除成功");
          this.tableData.splice(index, 1);
        })
        .catch(() => {});
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    delAllSelection() {
      const length = this.multipleSelection.length;
      let str = "";
      this.delList = this.delList.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + " ";
      }
      this.$message.error(`删除了${str}`);
      this.multipleSelection = [];
    },
    // 编辑操作
    handleEdit(index, row) {
      this.idx = index;
      this.form = row;
      this.editVisible = true;
    },
    // 保存编辑
    saveEdit() {
      this.editVisible = false;
      this.$message.success(`修改第 ${this.idx + 1} 行成功`);
      // this.$set(this.tableData, this.idx, this.form);
      this.tableData[this.idx] = this.form;
      // this.$forceUpdate();
    },
    // 分页导航
    handlePageChange(val) {
      // this.$set(this.query, 'pageIndex', val);
      this.query.pageIndex = val;
      this.getData();
    },
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
