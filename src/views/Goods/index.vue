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
          placeholder="商品名称"
          style="width: 180px;"
        ></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="searchMap.code"
          placeholder="商品编码"
          style="width: 180px;"
        ></el-input>
      </el-form-item>
      <!--  el-input是组件，要在组件元素监听原生事件，需要使用v-on:原生事件名.native="处理含税"          -->
      <el-form-item prop="supplierName">
        <el-input
          readonly
          @click.native="dialogSupplierVisible = true"
          v-model="searchMap.supplierName"
          placeholder="供应商"
          style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData"
          >查询</el-button
        >
        <el-button @click="resetForm('searchForm')">重置</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="handleAdd"
          >新建</el-button
        >
      </el-form-item>
    </el-form>

    <el-table :data="list" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column prop="name" label="商品名称" width="180">
      </el-table-column>
      <el-table-column prop="code" label="商品编码" width="180">
      </el-table-column>
      <el-table-column prop="spec" label="商品规格" width="180">
      </el-table-column>
      <el-table-column prop="retailPrice" label="零售价" width="180">
      </el-table-column>
      <el-table-column prop="purchasePrice" label="进货价" width="180">
      </el-table-column>
      <el-table-column prop="storageNum" label="库存数量" width="180">
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商" width="180">
      </el-table-column>
      <el-table-column label="操作" width="100">
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
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <el-dialog
      title="选择供应商"
      :visible.sync="dialogSupplierVisible"
      width="500px"
    >
      <supplier :isDialog="true" @option-supplier="optionSupplier"></supplier>
    </el-dialog>
    <el-dialog title="商品编辑" :visible.sync="dialogVisible" width="500px">
      <el-form
        :model="addNew"
        :rules="rules"
        ref="addNewForm"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="addNew.name"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" prop="code">
          <el-input v-model="addNew.code"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="spec">
          <el-input v-model="addNew.spec"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model="addNew.retailPrice"></el-input>
        </el-form-item>
        <el-form-item label="进货价" prop="purchasePrice">
          <el-input v-model="addNew.purchasePrice"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="storageNum">
          <el-input v-model="addNew.storageNum"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierName">
          <el-input
            readonly
            @click.native="editOptionSupplier"
            v-model="addNew.supplierName"
            placeholder="选择供应商"
            style="width: 200px;"
          >
          </el-input>
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
import goodsApi from "@/api/goods.js";

//Supplier 作为子组件
import Supplier from "@/views/Supplier";
export default {
  //注册子组件
  components: { Supplier },
  data() {
    return {
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        name: "",
        code: "",
        supplierName: "",
        supplierId: ""
      },
      addNew: {
        id: null,
        name: "",
        code: "",
        spec: "",
        retailPrice: 0.0,
        purchasePrice: 0.0,
        storageNum: 0,
        supplierName: "",
        supplierId: null
      },
      dialogSupplierVisible: false,
      rules: {
        name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "商品编码不能为空", trigger: "blur" }
        ],
        retailPrice: [
          { required: true, message: "零售价不能为空", trigger: "blur" }
        ]
      },
      dialogVisible: false,
      isEdit: false
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    editOptionSupplier() {
      this.isEdit = true;
      this.dialogSupplierVisible = true;
    },
    fetchData() {
      goodsApi
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["addNewForm"].resetFields();
      });
    },
    handleEdit(id) {
      this.handleAdd();
      goodsApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.addNew = resp.data;
        } else {
          return false;
        }
      });
    },
    handleDel(id) {
      this.$confirm("确认删除这条记录吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      }).then(() => {
        goodsApi.delete(id).then(response => {
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
    optionSupplier(currentRow) {
      if (this.isEdit) {
        this.addNew.supplierName = currentRow.name;
        this.addNew.supplierId = currentRow.id;
      } else {
        this.searchMap.supplierName = currentRow.name;
        this.searchMap.supplierId = currentRow.id;
      }
      this.isEdit = false;
      this.dialogSupplierVisible = false;
    },
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          goodsApi.add(this.addNew).then(response => {
            const resp = response.data;
            this.$message({
              message: resp.message,
              type: resp.flag ? "success" : "error"
            });
            if (resp.flag) {
              this.dialogVisible = false;
              this.fetchData();
            }
          });
        } else {
          return false;
        }
      });
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          goodsApi.update(this.addNew).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "error"
              });
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
