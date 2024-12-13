<template>
   <div class="login-page">
      <validate-form @form-submit="onFormSubmit">
         <div class="mb-3">
            <label class="form-label">邮箱地址</label>
            <validate-input :rules="emailRules" v-model="emailVal" placeholder="请输入邮箱地址" type="text" />
         </div>
         <div class="mb-3">
            <label class="form-label">密码</label>
            <validate-input type="password" placeholder="请输入密码" :rules="passwordRules" v-model="passwordVal" />
         </div>
      </validate-form>
   </div>
</template>

<script lang="ts">
   import { defineComponent, ref } from "vue";
   import { useRouter } from "vue-router";
   import { useStore } from "vuex";
   import ValidateInput, { RulesProp } from "../components/ValidateInput.vue";
   import ValidateForm from "../components/ValidateForm.vue";
   import { GlobalDataProps } from "@/store";
   import createMessage from "@/components/Message/createMessage";

   export default defineComponent({
      name: "Login",
      components: {
         ValidateInput,
         ValidateForm
      },
      setup() {
         const router = useRouter();
         const store = useStore<GlobalDataProps>();
         const emailVal = ref("");
         const emailRules: RulesProp = [
            { type: "required", message: "电子邮箱地址不能为空" },
            { type: "email", message: "请输入正确的电子邮箱格式" }
         ];
         const passwordVal = ref("");
         const passwordRules: RulesProp = [
            { type: "required", message: "密码不能为空" },
            { type: "min", message: "密码不能小于6位", length: 6 },
            { type: "max", message: "密码不能大于20位", length: 20 }
         ];
         const onFormSubmit = (result: boolean) => {
            if (result) {
               const payload = {
                  email: emailVal.value,
                  password: passwordVal.value
               };
               store
                  .dispatch("loginAndFetch", payload)
                  .then((data) => {
                     createMessage("登陆成功 2秒跳转首页", "success", 2000);
                     setTimeout(() => {
                        router.push("/");
                     }, 2000);
                  })
                  .catch((e) => {
                     console.log(e);
                  });
            }
         };
         return {
            emailRules,
            emailVal,
            passwordVal,
            passwordRules,
            onFormSubmit
         };
      }
   });
</script>
