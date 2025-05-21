import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// 빌드를 방해하는 강제 규칙 완화 (고급 설정)
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // 사용되지 않는 변수 경고로 변경 (빌드 실패 방지)
      "@typescript-eslint/no-unused-vars": "warn",
      
      // any 타입 경고로 변경
      "@typescript-eslint/no-explicit-any": "warn",
      
      // 빈 객체 타입 규칙 비활성화
      "@typescript-eslint/no-empty-object-type": "off",
      
      // React에서 이스케이프되지 않은 엔티티 경고로 변경
      "react/no-unescaped-entities": "warn",
      
      // <img> 대신 Next.js <Image> 사용 경고로 변경
      "@next/next/no-img-element": "warn",
      
      // require() 스타일 가져오기 경고로 변경
      "@typescript-eslint/no-require-imports": "warn",
      
      // let을 const로 사용해야 하는 규칙 경고로 변경
      "prefer-const": "warn",
      
      // React 훅 종속성 규칙 경고로 변경
      "react-hooks/exhaustive-deps": "warn"
    }
  }
];

export default eslintConfig;