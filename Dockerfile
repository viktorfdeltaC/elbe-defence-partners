# The site as Coolify runs it: one Node process that delivers the prerendered
# pages and answers the contact form (/api/kontakt).
#
# Mail credentials are runtime variables in Coolify — never build variables:
# the build must not see them, and nothing here writes them into the image.

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4321
# tini as PID 1. Node in that seat has no handler for SIGTERM and the kernel
# drops it, so every redeploy would wait out Docker's stop timeout and end in
# a SIGKILL. tini passes the signal on and node stops at once.
RUN apk add --no-cache tini
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force
COPY --from=build /app/dist ./dist
USER node
EXPOSE 4321
# Coolify sets PORT itself, from "Ports Exposes"; the server binds to it, and
# the check follows it. Shell form, so ${PORT} is read at every check.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:${PORT}/" || exit 1
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "./dist/server/entry.mjs"]
