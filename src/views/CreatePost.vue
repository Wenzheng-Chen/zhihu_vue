<template>
   <h3>新建文章</h3>
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
</template>
<script lang="ts">
   import ValidateForm from "@/components/ValidateForm.vue";
   import ValidateInput from "@/components/ValidateInput.vue";
   import { RulesProp } from "@/components/ValidateInput.vue";
   import { useRouter } from "vue-router";
   import { GlobalDataProps } from "@/store";
   import { PostProps } from "@/components/PostList.vue";
   import { defineComponent, ref } from "vue";
   import { useStore } from "vuex";

   export default defineComponent({
      components: {
         ValidateForm,
         ValidateInput
      },
      setup(props) {
         const titleVal = ref("");
         const titleRules: RulesProp = [{ type: "required", message: "文章标题不能为空" }];
         const contentVal = ref("");
         const contentRules: RulesProp = [{ type: "required", message: "文章内容不能为空" }];

         const store = useStore<GlobalDataProps>();
         const router = useRouter();

         const onFormSubmit = (result: boolean) => {
            if (result) {
               const { column } = store.state.user;
               if (column) {
                  console.log("test", titleVal.value, contentVal.value);
                  const newPost: PostProps = {
                     _id: new Date().getTime().toString(),
                     title: titleVal.value,
                     content: contentVal.value,
                     column: column,
                     createdAt: new Date().toLocaleString()
                  };
                  store.commit("createPost", newPost);
                  router.push({ name: "column", params: { id: column } });
               }
            }
         };
         return { titleVal, titleRules, contentVal, contentRules, onFormSubmit };
      }
   });
</script>
