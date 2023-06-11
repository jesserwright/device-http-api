# docker run --platform linux/amd64 --hostname dev -v .:/repo -p 8080:80 --network ea0c006d7bcf -it dev
# POSTGRES_PASSWORD=password POSTGRES_HOSTNAME=database /root/.deno/bin/deno run -A /repo/http/main.ts
# docker exec -it device-http-api-db-1 psql -U postgres
# docker exec -it bf0244785363 nvim /repo   (dev container)

# macos psql
# psql postgresql://postgres:password@localhost:5432/postgres

FROM archlinux:latest
RUN pacman -Syu --noconfirm
RUN pacman -Scc
RUN pacman -Sy --noconfirm unzip neovim git
RUN curl -fsSL https://deno.land/x/install/install.sh | sh
CMD ["/bin/sh"]
