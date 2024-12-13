<template>
   <div class="validate-input-container pb-3">
      <input
         v-if="tag !== 'textarea'"
         class="form-control"
         :class="{ 'is-invalid': inputRef.error }"
         :value="inputRef.val"
         @input="updateValue"
         @blur="validateInput"
         v-bind="$attrs"
      />
      <textarea
         v-else
         class="form-control"
         :class="{ 'is-invalid': inputRef.error }"
         :value="inputRef.val"
         @input="updateValue"
         @blur="validateInput"
         v-bind="$attrs"
      ></textarea>
      <span v-if="inputRef.error" class="invalid-feedback">{{ inputRef.message }}</span>
   </div>
</template>

<script lang="ts">
   import { defineComponent, onMounted, PropType, reactive } from "vue";
   import { emitter } from "./ValidateForm.vue";
   interface RuleProp {
      type: "required" | "email" | "min" | "max" | "custom";
      message: string;
      length?: number;
      validator?: () => boolean;
   }
   export type RulesProp = RuleProp[];
   export type TagType = "input" | "textarea";
   const emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

   export default defineComponent({
      name: "ValidateInput",
      inheritAttrs: false,
      props: {
         rules: Array as PropType<RuleProp[]>,
         modelValue: String,
         tag: {
            type: String as PropType<TagType>,
            default: "input"
         }
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
                     case "custom":
                        passed = rule.validator ? rule.validator() : true;
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
