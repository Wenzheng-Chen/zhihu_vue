<template>
   <form action="" class="validate-form-container">
      <slot></slot>
      <div class="submit-area" @click.prevent="submitForm">
         <slot name="submit">
            <button type="submit" class="btn btn-primary">提交</button>
         </slot>
      </div>
   </form>
</template>

<script lang="ts">
   import { defineComponent, onUnmounted } from "vue";
   import mitt from "mitt";
   type ValidateFunc = () => boolean;
   type ClearFunc = () => void;
   type Events = {
      "form-item-created": ValidateFunc;
      "form-item-clear": ClearFunc;
   };
   export const emitter = mitt<Events>();
   export default defineComponent({
      name: "ValidateForm",
      emits: ["form-submit"],
      setup(props, context) {
         let funcArr: ValidateFunc[] = [];
         let clearFuncs: ClearFunc[] = [];
         const submitForm = () => {
            const result = funcArr.map((func) => func()).every((result) => result);
            context.emit("form-submit", result);
            clearInputs();
         };
         const registerValidateFunc = (validateFunc: ValidateFunc) => {
            funcArr.push(validateFunc);
         };
         const registerClearFunc = (clearFunc: ClearFunc) => {
            clearFuncs.push(clearFunc);
         };
         const clearInputs = () => {
            clearFuncs.forEach((clearFunc) => clearFunc());
         };

         emitter.on("form-item-created", registerValidateFunc);
         emitter.on("form-item-clear", registerClearFunc);
         onUnmounted(() => {
            emitter.off("form-item-created", registerValidateFunc);
            emitter.off("form-item-clear", registerClearFunc);
         });
         return {
            submitForm
         };
      }
   });
</script>
