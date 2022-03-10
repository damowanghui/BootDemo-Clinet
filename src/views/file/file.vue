<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showUploadFile" v-permission="'file:upload'">上传</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" v-loading="listLoading"  border fit
              highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="fileName" label="文件名" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="createUser" label="上传人" width="170"/>
      <el-table-column align="center" prop="createTime" label="上传时间" width="170"/>
      <el-table-column align="center" label="管理" width="200" >
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="fileDownload(scope.$index)"  v-permission="'file:download'">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageRow"
      :total="totalCount"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="file" label-position="left" label-width="60px"
               style='width: 500px; margin-left:50px;'>
        <el-form-item label="文件">
          <el-upload
            style="display:inline-block"
            class="upload-demo"
            ref="upload"
            :action="uploadParam.action"
            :multiple="uploadParam.multiple"
            :limit="uploadParam.limit"
            :auto-upload="uploadParam.autoUpload"
            :accept="uploadParam.accept"
            :file-list="uploadParam.fileList"
            :on-change="handleUploadChange"
            :on-exceed="handleUploadExceed"
            :on-remove="handleUploadRemove"
            >
            <el-button slot="trigger" size="small" type="primary" plain>选取文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button style="margin-left: 10px;" size="small" icon="el-icon-upload2" type="success" @click="submitUpload">上传</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

  import {getUploadParam, uploadFileList} from "../../utils/fileUploadParam";

  export default {
    data() {
      return {
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
        listQuery: {
          pageNum: 1,//页码
          pageRow: 10,//每页条数
          name: ''
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          create: '上传文件'
        },
        file: {
          id: "",
          fileName: "",
          createUser: "",
          createTime: ""
        },
        uploadParam: getUploadParam(),
        fileList: []
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        //查询列表
        if (!this.hasPerm('file:list')) {
          return
        }
        this.listLoading = true;
        this.api({
          url: "/file/list",
          method: "get",
          params: this.listQuery
        }).then(data => {
          this.listLoading = false;
          this.list = data.list;
          this.totalCount = data.totalCount;
        })
      },
      handleSizeChange(val) {
        //改变每页数量
        this.listQuery.pageRow = val
        this.handleFilter();
      },
      handleCurrentChange(val) {
        //改变页码
        this.listQuery.pageNum = val
        this.getList();
      },
      handleFilter() {
        //改变了查询条件,从第一页开始查询
        this.listQuery.pageNum = 1
        this.getList()
      },
      getIndex($index) {
        //表格序号
        return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
      },
      // 文件相关
      showUploadFile() {
        // this.tempArticle.content = "";
        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },
      handleUploadChange(file, fileList) {
        this.uploadParam.fileList = fileList
      },
      // 超出文件限制提示
      handleUploadExceed() {
        this.$message.warning("文件不能超过" + this.uploadParam.limit + "个哦")
      },
      handleUploadRemove(file, fileList) {
        this.uploadParam.fileList = fileList
      },
      submitUpload() {
        let uploadForm = new FormData()
        this.uploadParam.fileList.forEach((val, index) => {
          uploadForm.append("multipartFiles", val.raw)
        })

        uploadFileList(uploadForm).then(res => {
          if (res.data.code === '200'){
            this.$message.success("上传文件成功")
          } else {
            this.$message.error(res.data.msg)
          }
        })
        this.fileList = []
        this.uploadParam.fileList = []
        this.dialogFormVisible = false
        this.getList()
      },
      fileDownload(index) {
        console.log(index)
        console.log(this.list[index].id)

      },
      // end
      showCreate() {
        //显示新增对话框
        // this.tempArticle.content = "";
        this.dialogStatus = "create"
        this.dialogFormVisible = true
      }
    }
  }
</script>
