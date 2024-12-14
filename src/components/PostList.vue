<template>
   <div class="post-list">
      <article v-for="post in list" :key="post._id" class="card mb-3 shadow-sm">
         <div class="card-body">
            <h4>{{ post.title }}</h4>
            <div class="row my-3 align-items-center">
               <div v-if="post.image && typeof post.image !== 'string'" class="col-4">
                  <img :src="post.image.fitUrl" :alt="post.title" class="rounded-lg w-100" />
               </div>
               <p :class="{ 'col-9': post.image }">{{ post.excerpt }}</p>
            </div>
            <span class="text-muted">{{ post.createdAt }}</span>
         </div>
      </article>
   </div>
</template>

<script lang="ts">
   import { computed, defineComponent, PropType } from "vue";
   import { ImageProps } from "./ColumnList.vue";
   import { generateFitUrl } from "@/helper";

   export interface PostProps {
      _id?: string;
      title: string;
      excerpt?: string;
      content?: string;
      image?: ImageProps | string;
      createdAt?: string;
      column: string;
      author?: string;
   }

   export default defineComponent({
      props: {
         list: {
            required: true,
            type: Array as PropType<PostProps[]>
         }
      },
      setup(props) {
         const posts = computed(() => {
            return props.list.map((post) => {
               generateFitUrl(post.image as ImageProps, 200, 110, ["m_fill"]);
               return post;
            });
         });
         return {
            posts
         };
      }
   });
</script>
<style scoped>
   .post-list h4 a {
      text-decoration: none;
      color: #1a1a1a;
   }
   .post-list h4 a:hover {
      color: #0d6efd;
   }
</style>
