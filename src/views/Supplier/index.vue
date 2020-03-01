<template>
  <div>
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      style="margin-top: 20px;"
    >
      <el-form-item prop="name">
        <el-input
          v-model="searchMap.name"
          placeholder="供应商名称"
          style="width: 180px;"
        ></el-input>
      </el-form-item>
      <el-form-item prop="linkman">
        <el-input v-if="!isDialog"
          v-model="searchMap.linkman"
          placeholder="联系人"
          style="width: 180px;"
        ></el-input>
      </el-form-item>
      <el-form-item prop="mobile">
        <el-input v-if="!isDialog"
          v-model="searchMap.mobile"
          placeholder="联系电话"
          style="width: 180px;"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData"
          >查询</el-button
        >
        <el-button  v-if="!isDialog" @click="resetForm('searchForm')">重置</el-button>
        <el-button  v-if="!isDialog" type="primary" icon="el-icon-edit" @click="handleAdd"
          >新建</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
            :highlight-current-row="!isDialog"
            @current-change="handleCurrentRowChange"
            :data="list" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column prop="name" label="供应商名称" width="250">
      </el-table-column>
      <el-table-column prop="linkman" label="联系人" width="120">
      </el-table-column>
      <el-table-column v-if="!isDialog" prop="mobile" label="联系电话" width="180">
      </el-table-column>
      <el-table-column v-if="!isDialog" prop="remark" label="备注" width="250">
      </el-table-column>
      <el-table-column v-if="!isDialog" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row.id)" type="text" size="small"
            >编辑
          </el-button>
          <el-button @click="handleDel(scope.row.id)" type="text" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      :layout="!isDialog ? 'total, sizes, prev, pager, next, jumper' : 'prev, pager, next'"
      :total="total"
    >
    </el-pagination>
    <el-dialog v-if="!isDialog" title="供应商编辑" :visible.sync="dialogVisible" width="500px">
      <el-form
        :model="addNew"
        :rules="rules"
        ref="addNewForm"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
      >
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="addNew.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="addNew.linkman"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="addNew.mobile"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="addNew.remark"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            addNew.id === null
              ? addData('addNewForm')
              : updateData('addNewForm')
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import supplierAPi from "@/api/supplier";
export default {
  // 接收父组件传递过来的数据，通过isDialog来判断，是否为弹框
  props: {
    isDialog: Boolean
  },
  data() {
    return {
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        name: "",
        linkman: "",
        mobile: ""
      },
      addNew: {
        id: null,
        name: "",
        linkman: "",
        mobile: "",
        remark: ""
      },
      dialogVisible: false,

      rules: {
        name: [
          { required: true, message: "供应商名称不能为空", trigger: "blur" }
        ],
        linkman: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      supplierAPi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          this.total = resp.data.total;
          this.list = resp.data.row;
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          supplierAPi.add(formName).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if(valid) {
          supplierAPi.update(formName).then(response => {
            const resp = response.data;
            this.$message({
              message: resp.message,
              type: resp.flag ? 'success' : 'error'
            });
            if(resp.flag) {
              this.fetchData();
              this.dialogVisible = false;
            }
          });
        }
      });
    },
    handleEdit(id) {
      this.handleAdd();

      supplierAPi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.addNew = resp.data;
        }
      });
    },
    handleDel(id) {
      this.$confirm("确认删除这条记录吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        supplierAPi.delete(id).then(response => {
          const resp = response.data;
          this.$message({
            message: resp.message,
            type: resp.flag ? "success" : "error"
          });
          if (resp.flag) {
            this.fetchData();
          }
        });
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["addNewForm"].resetFields();
      });
    },
    //将数据传递到父组件
    //父组件可以在option-supplier这个事件对应的处理函数中进行接收数据currentRow
    handleCurrentRowChange(currentRow) {
      this.$emit('option-supplier', currentRow);
    }
  }
};
</script>

<style scoped></style>
