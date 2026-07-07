// The ChromaKit logo as an inlined 64px webp data URI (source: public/favicon.png).
// Regenerate with:
//   cwebp -q 82 -resize 64 64 client/public/favicon.png -o /tmp/logo.webp
//   then base64-encode: `echo "data:image/webp;base64,$(base64 -i /tmp/logo.webp | tr -d '\n')"`
// Inlined because it's <1KB and appears in the header + footer of every page:
// avoids two HTTP requests and, because the src is a data: URI, is exempt from
// Astro's image-loading dev audits (which otherwise can't be satisfied by a single
// static loading value across both short and tall pages).
export const LOGO_DATA_URI =
  'data:image/webp;base64,UklGRhwDAABXRUJQVlA4IBADAAAwEQCdASpAAEAAPmEqkUWkIqGrpg2JcAwJbAC+gUF+AfiBzkkOvO+afWv6NfLukr4lu4A/Z7qHegB+4HWAegB5ansVfuF6OuYQTef9zagKZT4pnlPoMfrMdf/0BcAJmDhJZ2KRhV2+2Om53XtagpCuzUf5Jk+PCM7ssdq8kpQZ8QiPj1sWRWL+KgrRNDkihn434AD+9Z/36ct0p9WT3b5OoJw57OO5z3dV5BlozoXJv/gTv8Cd7Hj6NcL4T1Q/u83+3m+UDyym9yd/MqozVOS7tmjKNPttTyLqpR2S3geRE2+zKn+mroZYD5/d22yd06YHTOylXmvqvH9RchX/NXapG2DLAIy6kiHAPK/mps0W0yFC1rjFPF99f60BnGl+v+m72c7C7tK4Ed7yhTjRteSlYWVIsrtVPMKnaM2P6T4a/eaBb056Dudr8eFq98xgr27SHJJIWAV7i/MKGvIV9dzdyeA0YQYmbwmBU54Vam+YbjN6Tz6CTF+/h0/ZOx/8Lu/R3M1Yc9+4MamYPCrvArcutv1CNYddWa2o4B/SFQk3FTg6TNNAzvWOip0KrPgLN5/K6g71OWzSIFmF6hCJz7ZqyRnHveOEMtfV0cjZOMuH6pi0/2pTA//9yZG3g55DXmDjZPN1M5i1LBcXDY20RhYiHNneHQqPjAXfcCPocfA9bKUZlBFNZ9XsccJqHNaMxecpyeVi/6LXVJ5EzXA8RHzYyBpJ2YpBSbPvwGX2aAEJHnxS2nuUyqKmwVnTK6WKyEi4Koya+Cx54pkXCtzWEdJ78lbwmtiBW94zVb84bc7aUPfiKmp9+oSop+1eAjkMCL+YlwMEIEKC41I9a89gXhcO1Q52g/+p1g9YR0QXfOIAB8u4D9ctkBNXRK0uh6YrNbbv+g7SkFqLJAot+BkaY3jW1f0EF/YHpkwDsYQMwNrrsacJjA0p8EhUb6ePSYlNbfxcE/pGjmA5BYdFeMxLfq4G+LvNE7m6uagCOg2xPK8NpFMit5ZTus5TQvzUL29u5CsepKRZskMIzvuMIvro0AAA';
