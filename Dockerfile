FROM denoland/deno:2.0.2
EXPOSE 3000
WORKDIR /app
USER deno
COPY . .
RUN deno cache main.ts
CMD ["run", "--allow-net", "--allow-read", "--allow-env", "--allow-sys", "main.ts"]
