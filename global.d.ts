// global.d.ts
import type React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "el-dropdown": any;
      "el-menu": any;
    }
  }
}

export {};
