<template>
   <div class="create-post-page">
      <h4>新建文章</h4>
      <uploader
         action="/upload"
         class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
         :beforeUpload="uploadCheck"
         @file-uploaded="handleFileUploaded"
      >
         <h2>点击上传头图</h2>

         <template v-slot:loading>
            <div class="d-flex">
               <div class="spinner-border text-secondary" role="status"></div>
            </div>
            <h2>正在上传</h2>
         </template>

         <template v-slot:uploaded="dataProps">
            <img :src="dataProps.uploadedData.data.url" alt="" />
         </template>
      </uploader>
      <validate-form @form-submit="onFormSubmit">
         <div class="mb-3">
            <label class="form-label">文章标题</label>
            <validate-input v-model="titleVal" :rules="titleRules" placeholder="请输入文章标题" type="text" />
         </div>
         <div class="mb-3">
            <label class="form-label">文章详情</label>
            <validate-input
               v-model="contentVal"
               :rules="contentRules"
               tag="textarea"
               rows="10"
               type="text"
               placeholder="请输入文章详情"
            />
         </div>
      </validate-form>
   </div>
</template>
<script lang="ts">
   import ValidateForm from "@/components/ValidateForm.vue";
   import ValidateInput from "@/components/ValidateInput.vue";
   import { RulesProp } from "@/components/ValidateInput.vue";
   import { useRouter } from "vue-router";
   import { GlobalDataProps, ResponseType } from "@/store";
   import { PostProps } from "@/components/PostList.vue";
   import { defineComponent, ref } from "vue";
   import { useStore } from "vuex";
   import Uploader from "@/components/Uploader.vue";
   import { beforeUploadCheck } from "@/helper";
   import createMessage from "@/components/Message/createMessage";
   import { ImageProps } from "@/components/ColumnList.vue";

   export default defineComponent({
      components: {
         ValidateForm,
         ValidateInput,
         Uploader
      },
      setup(props) {
         const titleVal = ref("");
         const titleRules: RulesProp = [{ type: "required", message: "文章标题不能为空" }];
         const contentVal = ref("");
         const contentRules: RulesProp = [{ type: "required", message: "文章内容不能为空" }];

         const store = useStore<GlobalDataProps>();
         const router = useRouter();
         let imageId = "";

         const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
            if (rawData.data._id) {
               imageId = rawData.data._id;
            }
         };

         const onFormSubmit = (result: boolean) => {
            if (result) {
               const { column, _id } = store.state.user;
               if (column) {
                  const newPost: PostProps = {
                     title: titleVal.value,
                     content: contentVal.value,
                     column: column,
                     author: _id
                  };
                  if (imageId) {
                     newPost.image = imageId;
                  }
                  store.dispatch("create", newPost).then(() => {
                     createMessage("发表成功, 2秒后跳转到文章", "success", 2000);
                     setTimeout(() => {
                        router.push({ name: "column", params: { id: column } });
                     }, 2000);
                  });
               }
            }
         };

         const uploadCheck = (file: File) => {
            const result = beforeUploadCheck(file, { format: ["image/jpeg", "image/png"], size: 0.5 });
            const { passed, error } = result;
            if (error === "format") {
               createMessage("上传图片只能是JPG/PNG格式", "error", 2000);
            }
            if (error === "size") {
               createMessage("上传图片大小不能超过500KB", "error", 2000);
            }
            return passed;
         };
         return { titleVal, titleRules, contentVal, contentRules, onFormSubmit, uploadCheck, handleFileUploaded };
      }
   });
</script>

<style>
   .create-post-page .file-upload-container {
      height: 200px;
      cursor: pointer;
   }

   .create-post-page .file-upload-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
   }
</style>
