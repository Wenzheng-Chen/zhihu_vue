<template>
   <div class="sign-page">
      <validate-form @form-submit="onFormSubmit">
         <div class="mb-3">
            <label class="form-label">邮箱地址</label>
            <validate-input type="text" placeholder="请输入邮箱地址" :rules="emailRules" v-model="signUpinfo.email" />
         </div>
         <div class="mb-3">
            <label class="form-label">昵称</label>
            <validate-input type="text" placeholder="请输入昵称" :rules="nickNameRules" v-model="signUpinfo.nickName" />
         </div>
         <div class="mb-3">
            <label class="form-label">密码</label>
            <validate-input
               type="password"
               placeholder="请输入密码"
               :rules="passwordRules"
               v-model="signUpinfo.password"
            />
         </div>
         <div class="mb-3">
            <label class="form-label">重复密码</label>
            <validate-input
               type="password"
               placeholder="请再次输入密码"
               :rules="repeatPassword"
               v-model="signUpinfo.repeatPassword"
            />
         </div>
         <template v-slot:submit>
            <button type="submit" class="btn btn-primary">注册新用户</button>
         </template>
      </validate-form>
   </div>
</template>

<script lang="ts">
   import createMessage from "@/components/Message/createMessage";
   import ValidateForm from "@/components/ValidateForm.vue";
   import ValidateInput, { RulesProp } from "@/components/ValidateInput.vue";
   import router from "@/router";
   import { GlobalDataProps } from "@/store";
   import axios from "axios";
   import { defineComponent, reactive } from "vue";
   import { useStore } from "vuex";
   interface SignUpProps {
      email: string;
      nickName: string;
      password: string;
      repeatPassword: string;
   }

   export default defineComponent({
      components: {
         ValidateInput,
         ValidateForm
      },
      setup() {
         const store = useStore<GlobalDataProps>();
         const signUpinfo = reactive<SignUpProps>({
            email: "",
            nickName: "",
            password: "",
            repeatPassword: ""
         });
         const emailRules: RulesProp = [
            { type: "required", message: "电子邮箱地址不能为空" },
            { type: "email", message: "请输入正确的电子邮箱格式" }
         ];
         const nickNameRules: RulesProp = [{ type: "required", message: "昵称不能为空" }];
         const passwordRules: RulesProp = [
            { type: "required", message: "密码不能为空" },
            { type: "min", message: "密码不能小于6位", length: 6 },
            { type: "max", message: "密码不能大于20位", length: 20 }
         ];
         const repeatPassword: RulesProp = [
            {
               type: "custom",
               validator: () => {
                  return signUpinfo.password === signUpinfo.repeatPassword;
               },
               message: "两次输入的密码不一致"
            },
            { type: "required", message: "密码不能为空" }
         ];
         const onFormSubmit = (result: boolean) => {
            if (result) {
               axios
                  .post("/users", {
                     email: signUpinfo.email,
                     nickName: signUpinfo.nickName,
                     password: signUpinfo.password
                  })
                  .then((resp) => {
                     createMessage("注册新用户成功,正在为您跳转", "success", 2000);
                     store.dispatch("loginAndFetch", {
                        email: signUpinfo.email,
                        password: signUpinfo.password
                     });
                     console.log(resp);
                  })
                  .then(() => {
                     router.push("/");
                  })
                  .catch((e) => {
                     createMessage(store.state.error.message || "", "error");
                  });
            }
         };
         return { signUpinfo, emailRules, nickNameRules, passwordRules, repeatPassword, onFormSubmit };
      }
   });
</script>
