FROM denoland/deno:1.29.1

EXPOSE 80
USER deno

# Cache Dependencies
COPY deps.ts .
RUN deno cache deps.ts

# Server
COPY main.ts util.ts .
RUN deno cache main.ts

# Public Assets
COPY public/ public/

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "main.ts"]
