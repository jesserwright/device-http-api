FROM denoland/deno:latest

USER deno

COPY deps.ts .
RUN deno cache deps.ts

COPY main.ts util.ts .
RUN deno cache main.ts

COPY public/ public/

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "main.ts"]
EXPOSE 80
