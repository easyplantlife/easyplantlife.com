# Fonts

Self-hosted copies of the brand typefaces, loaded with `next/font/local` from
`src/app/fonts.ts`. Vendoring them keeps builds deterministic: a build never
has to reach fonts.googleapis.com, which has failed on hosted CI runners.

| File                              | Family        | Axis         | Subset | Licence |
| --------------------------------- | ------------- | ------------ | ------ | ------- |
| `lora-latin-wght.woff2`           | Lora          | wght 400–700 | latin  | OFL 1.1 |
| `source-sans-3-latin-wght.woff2`  | Source Sans 3 | wght 300–600 | latin  | OFL 1.1 |

Both families are published under the SIL Open Font License 1.1
(Lora by Cyreal, Source Sans 3 by Adobe). The files were downloaded from the
Google Fonts CDN as variable, latin-subset woff2.
