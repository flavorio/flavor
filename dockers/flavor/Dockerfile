ARG NODE_VERSION=20.9.0
ARG BUILD_VERSION="1.0.0-alpha"

###################################################################
# Stage 1: Install all workspaces (dev)dependencies               #
#          and generates node_modules folder(s)                   #
###################################################################

FROM node:${NODE_VERSION}-bookworm AS deps
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && pnpm add npm-run-all2 zx -g


# Disabling some well-known postinstall scripts
ENV HUSKY=0

WORKDIR /workspace-install

COPY --link package.json pnpm-workspace.yaml pnpm-lock.yaml ./

RUN pnpm fetch

COPY --link . .

RUN pnpm install --prefer-offline --frozen-lockfile


RUN pnpm -F @flavor/backend prisma-generate --schema ./prisma/schema.prisma

###################################################################
# Stage 2: Build the app                                          #
###################################################################

FROM deps AS builder

WORKDIR /app

COPY --from=deps --link /workspace-install ./
