import { ImageProps } from "./components/ColumnList.vue";

export function generateFitUrl(data: ImageProps, width: number, height: number, format = ["m_pad"]) {
   if (data && data.url) {
      const formatStr = format.reduce((prev, current) => {
         return current + "," + prev;
      }, "");
      data.fitUrl = data.url + `?x-oss-process=image/resize,${formatStr}h_${height},w_${width}`;
   }
}

interface CheckCondition {
   format?: string[];
   size?: number;
}

type ErrorType = "size" | "format" | null;
export function beforeUploadCheck(file: File, condition: CheckCondition) {
   const { format, size } = condition;
   const isValidFormat = format ? format.includes(file.type) : true;
   const isvalidSize = size ? file.size / 1024 / 1024 < size : true;
   let error: ErrorType = null;
   if (!isValidFormat) {
      error = "format";
   }
   if (!isvalidSize) {
      error = "size";
   }
   return {
      passed: isValidFormat && isvalidSize,
      error
   };
}
