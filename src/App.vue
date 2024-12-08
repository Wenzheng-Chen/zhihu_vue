<template>
   <div class="container">
      <global-header :user="currentUser"></global-header>
      <!-- <column-list :list="list"></column-list> -->
      <validate-form action="" @form-submit="onFormSubmit">
         <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">邮箱地址</label>
            <validate-Input
               :rules="emailRules"
               v-model="emailVal"
               placeholder="请输入邮箱地址"
               ref="inputRef"
            ></validate-Input>
         </div>
         <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">密码</label>
            <validate-Input
               :rules="passwordRules"
               v-model="passwordVal"
               placeholder="请输入密码"
               type="password"
            ></validate-Input>
         </div>
         <template #submit>
            <span class="btn btn-danger">Submit</span>
         </template>
      </validate-form>
   </div>
</template>

<script lang="ts">
   import { defineComponent, reactive, ref } from "vue";
   import "bootstrap/dist/css/bootstrap.min.css";
   import ColumnList, { ColumnProps } from "./components/ColumnList.vue";
   import GlobalHeader, { UserProps } from "./components/GlobalHeader.vue";
   import ValidateInput, { RulesProp } from "./components/ValidateInput.vue";
   import ValidateForm from "./components/ValidateForm.vue";
   const testData: ColumnProps[] = [
      {
         id: 1,
         title: "test1专栏",
         description: "this is description",
         avatar: "url "
      },
      {
         id: 2,
         title: "test2专栏",
         description: "this is description",
         avatar: "url "
      },
      {
         id: 2,
         title: "test2专栏",
         description: "this is description",
         avatar: "url "
      },
      {
         id: 2,
         title: "test2专栏",
         description: "this is description",
         avatar: "url "
      },
      {
         id: 2,
         title: "test2专栏",
         description: "this is description",
         avatar: "url "
      },
      {
         id: 2,
         title: "test2专栏",
         description: "this is description",
         avatar: "url "
      },
      {
         id: 2,
         title: "test2专栏",
         description: "this is description"
      }
   ];

   const currentUser: UserProps = {
      isLogin: true,
      name: "wenzheng"
   };

   export default defineComponent({
      name: "App",
      components: {
         // ColumnList,
         GlobalHeader,
         ValidateInput,
         ValidateForm
      },
      setup() {
         const inputRef = ref<any>();
         const emailVal = ref("");
         const passwordVal = ref("");
         const emailRules: RulesProp = [
            {
               type: "required",
               message: "电子邮件地址不能为空"
            },
            {
               type: "email",
               message: "请输入正确的电子邮箱格式"
            }
         ];

         const passwordRules: RulesProp = [
            {
               type: "required",
               message: "密码地址不能为空"
            },
            {
               type: "min",
               message: "你的密码至少包含6位",
               length: 6
            },
            {
               type: "max",
               message: "你的密码不能超过20位",
               length: 20
            }
         ];
         const onFormSubmit = (result: boolean) => {
            console.log(result);
         };
         return { testData, currentUser, emailRules, emailVal, passwordRules, passwordVal, onFormSubmit, inputRef };
      }
   });
</script>

<style></style>
