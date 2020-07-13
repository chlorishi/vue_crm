<template>
  <div>
    <el-card>
      {{ articleEditForm }}
      <el-form
        :model="articleEditForm"
        :rules="rules"
        ref="articleEditFormRef"
        class="demo-ruleForm"
      >
        <div class="header">
          <div class="header-left">
            <el-form-item prop="title">
              <el-input
                v-model="articleEditForm.title"
                maxlength="50"
                show-word-limit
                placeholder="文章标题"
              ></el-input>
            </el-form-item>
          </div>

          <div class="header-right">
            <el-form-item prop="idChannel">
              <el-select
                v-model="articleEditForm.idChannel"
                placeholder="请选择文章类型"
              >
                <el-option
                  :label="item.name"
                  v-for="item in list"
                  :key="item.id"
                  :value="item.id"
                  >{{ item.name }}</el-option
                >
              </el-select>
            </el-form-item>
          </div>
          <el-button type="primary" @click="a">发布文章</el-button>
        </div>
      </el-form>
      <div>
        <div ref="editorRef" class="editor"></div>
      </div>
    </el-card>
  </div>
</template>


<script>
import wangeditor from "wangeditor";
import { http, channellist, article, file } from "../../api/api";
export default {
  data() {
    return {
      articleEditForm: {
        title: "",
        idChannel: "",
        content: ""
      },
      rules: {},
      list: [],
      editor: ""
    };
  },
  mounted() {
    this.editor = new wangeditor(this.$refs.editorRef);
    this.editor.customConfig.showLinkImg = false;
    this.editor.customConfig.uploadImgServer = "/upload";
    this.editor.customConfig.uploadImgMaxLength = 1;
    this.editor.customConfig.customUploadImg = (files, insert) => {
      // files 是 input 中选中的文件列表
      // insert 是获取图片 url 后，插入到编辑器的方法
      let f = files[0];
      let d = new FormData();
      d.append("file", f);
      this.$http
        .post(http + file, d, {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: localStorage.token
          }
        })
        .then(
          data => {
            if (data.data.msg == "成功") {
              insert(data.data.data.realFileName);
            } else {
              this.$message.error(data.data.msg);
            }
          },
          err => {
            this.$message.error(err.data.message);
          }
        );
    };
    this.editor.create();
    this.getChannelList();
  },

  methods: {
    a() {
      let json = {
        author: this.$store.state.user.info.profile.name,
        content: this.editor.txt.html().replace(/\%/g, "%25"),
        idChannel: this.articleEditForm.idChannel,
        title: this.articleEditForm.title
      };
      var flag = true;
      for (var i in json) {
        if (json[i] == "") {
          flag = false;
        }
      }
      if (flag) {
        this.$http
          .post(http + article, JSON.stringify(json))
          .then(res => {
            if (res.data.msg == "成功") {
              this.$msg.success("提交成功");
              this.$router.push('/article')
            } else {
              this.$msg.error(res.data.msg);
            }
          })
          .catch(err => this.$msg.error(err.data.message));
      } else {
        this.$msg.error("请补全数据");
      }
    },
    getChannelList() {
      this.$http
        .get(http + channellist)
        .then(res => {
          if (res.data.msg == "成功") {
            this.list = res.data.data;
          } else {
            this.$msg.error(res.data.msg);
          }
        })
        .catch(err => this.$msg.error(err.data.message));
    }
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  height: 40px;
  margin-bottom: 15px;
}
.header-left {
  width: 1000px;
}
.editor {
  z-index: 3;
  position: relative;
}
</style>


