<template>
  <div>
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      style="margin-top: 20px;"
    >
      <el-form-item prop="cardNum">
        <el-input
          v-model="searchMap.cardNum"
          placeholder="会员卡号"
          style="width: 180px;"
        ></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input
          v-model="searchMap.name"
          placeholder="会员名称"
          style="width: 180px;"
        ></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select
          v-model="searchMap.payType"
          placeholder="支付类型"
          style="width: 110px;"
        >
          <el-option
            v-for="option in payTypeOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <el-date-picker
          value-format="yyyy-MM-dd"
          type="date"
          v-model="searchMap.birthday"
          placeholder="会员生日"
        ></el-date-picker>
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
      <el-table-column prop="cardNum" label="会员卡号" width="180">
      </el-table-column>
      <el-table-column prop="name" label="会员姓名" width="180">
      </el-table-column>
      <el-table-column prop="birthday" label="会员生日" width="180">
      </el-table-column>
      <el-table-column prop="phone" label="手机号码" width="180">
      </el-table-column>
      <el-table-column prop="integral" label="可用积分" width="180">
      </el-table-column>
      <el-table-column prop="money" label="开卡金额" width="180">
      </el-table-column>
      <el-table-column prop="payType" label="支付类型" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.payType | payTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="会员地址" width="180">
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

    <el-dialog title="会员编辑" :visible.sync="dialogVisible" width="500px">
      <el-form
        :model="addNew"
        :rules="rules"
        ref="addNewForm"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
      >
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="addNew.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="会员名称" prop="name">
          <el-input v-model="addNew.name"></el-input>
        </el-form-item>
        <el-form-item label="会员生日" prop="birthday">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            v-model="addNew.birthday"
            placeholder="请点击选择"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="addNew.phone"></el-input>
        </el-form-item>
        <el-form-item label="开卡金额" prop="money">
          <el-input v-model="addNew.money"></el-input>
        </el-form-item>
        <el-form-item label="可用积分" prop="integral">
          <el-input v-model="addNew.integral"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="payType">
          <el-select
            v-model="addNew.payType"
            class="filter-item"
            placeholder="请点击选择"
          >
            <el-option
              v-for="option in payTypeOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <el-input
            v-model="addNew.address"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
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
import memberApi from "@/api/member";
const payTypeOptions = [
  { type: "1", name: "现金" },
  { type: "2", name: "支付宝" },
  { type: "3", name: "微信" },
  { type: "4", name: "银行卡" }
];

export default {
  data() {
    return {
      list: [],
      total: 0, //总记录数
      currentPage: 1, //当前页，默认为1
      pageSize: 10, //每页显示数，默认10
      searchMap: {}, // 条件查询绑定条件值
      payTypeOptions,

      dialogVisible: false,

      addNew: {
        id: null,
        cardNum: "",
        name: "",
        birthday: "",
        phone: "",
        money: 0,
        integral: 0,
        payType: "",
        address: ""
      },
      rules: {
        cardNum: [{ required: true, message: "卡号不能为空", trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        payType: [
          { required: true, message: "请选择支付类型", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      memberApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          this.total = resp.data.total;
          this.list = resp.data.rows;
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
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          memberApi.add(this.addnew).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData(); //刷新列表
              this.dialogVisible = false; //关闭窗口
            } else {
              this.$message({
                message: resp.message,
                type: "error"
              });
            }
          });
        } else {
          // 验证不通过
          return false;
        }
      });
    },
    handleAdd() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["addNewForm"].resetFields();
      });
    },
    handleEdit(id) {
      //清空原数据
      this.handleAdd();

      memberApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.addNew = resp.data;
        }
      });
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          memberApi.update(this.addNew).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogVisible = false;
            } else {
              this.$message({
                message: resp.massage,
                type: "error"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    handleDel(id) {
      this.$confirm("确认删除这条记录吗", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          memberApi.deleteById(id).then(response => {
            const resp = response.data;
            this.$message({
              message: resp.message,
              type: resp.flag ? "success" : "error"
            });
            if (resp.flag) {
              this.fetchData();
            }
          });
        })
        .catch(() => {});
    }
  },
  filters: {
    payTypeFilter(type) {
      const obj = payTypeOptions.find(obj => obj.type === type);
      return obj ? obj.name : null;
    }
  }
};
</script>

<style scoped></style>
