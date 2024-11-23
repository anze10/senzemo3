# docker/dev.Dockerfile
FROM oven/bun:latest

WORKDIR /app/next-app

COPY package.json ./
COPY bun.lockb ./

RUN bun install

COPY . .

RUN  bun run build


# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at run time
ENV NEXT_TELEMETRY_DISABLED 1

# for deploting the build version

# RUN bun next build
# and
# CMD bun next start

# OR for sart Next.js in development, comment above two lines and uncomment below line



# Note: Don't expose ports here, Compose will handle that for us
# Command to start the Next.js app
CMD ["bun", "run", "start"]


