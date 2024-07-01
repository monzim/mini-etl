FROM node:20.15.0-alpine3.19 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN npx prisma generate
RUN pnpm run build

FROM base
LABEL author="Azraf Al Monzim"
LABEL maintainer="Azraf Al Monzim"

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/node_modules/.prisma/client /app/node_modules/@prisma/client
COPY --from=build /app/dist /app/dist

EXPOSE 3000
CMD [ "pnpm", "start:prod" ]
