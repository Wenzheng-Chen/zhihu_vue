<template>
   <div class="validate-input-container pb-3">
      <input
         class="form-control"
         :class="{ 'is-invalid': inputRef.error }"
         :value="inputRef.val"
         @input="updateValue"
         @blur="validateInput"
         v-bind="$attrs"
      />
      <span v-if="inputRef.error" class="invalid-feedback">{{ inputRef.message }}</span>
   </div>
</template>

<script lang="ts">
   import { defineComponent, onMounted, PropType, reactive } from "vue";
   import { emitter } from "./ValidateForm.vue";
   interface RuleProp {
      type: "required" | "email" | "min" | "max";
      message: string;
      length?: number;
   }
   export type RulesProp = RuleProp[];
   const emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

   export default defineComponent({
      name: "ValidateInput",
      inheritAttrs: false,
      props: {
         rules: Array as PropType<RuleProp[]>,
         modelValue: String
      },
      setup(props, context) {
         const inputRef = reactive({
            val: props.modelValue || "",
            error: false,
            message: ""
         });
         const updateValue = (e: Event) => {
            const targetValue = (e.target as HTMLInputElement).value;
            inputRef.val = targetValue;
            context.emit("update:modelValue", targetValue);
         };
         const validateInput = () => {
            if (props.rules) {
               const allPassed = props.rules.every((rule) => {
                  let passed = true;
                  inputRef.message = rule.message;
                  switch (rule.type) {
                     case "required":
                        passed = inputRef.val.trim() !== "";
                        break;
                     case "email":
                        passed = emailReg.test(inputRef.val);
                        break;
                     case "min":
                        if (rule.length !== undefined && inputRef.val.length < rule.length) {
                           passed = false;
                        }
                        break;
                     case "max":
                        if (rule.length !== undefined && inputRef.val.length > rule.length) {
                           passed = false;
                        }
                        break;
                     default:
                        break;
                  }
                  return passed;
               });
               inputRef.error = !allPassed;
               return allPassed;
            }
            return true;
         };
         const clearInput = () => {
            inputRef.val = "";
            inputRef.error = false;
            inputRef.message = "";
         };
         onMounted(() => {
            emitter.emit("form-item-created", validateInput);
            emitter.emit("form-item-clear", clearInput);
         });
         return { inputRef, validateInput, updateValue };
      }
   });
</script>
