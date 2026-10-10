import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // TypeScript 7 doesn't yet ship the compiler API that Next.js uses to
    // resolve types at build time. The CI workflow already runs
    // `npx tsc --noEmit` (TypeScript 7) for type checking, so we fall back to
    // the legacy TypeScript API path inside the Next.js build itself, where
    // the aliased `@typescript/typescript6` shim provides the v6 API.
    useTypeScriptCli: false,
  },
};

export default nextConfig;
