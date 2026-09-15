FROM python:3.13-slim
RUN useradd --create-home --uid 10001 sandbox
WORKDIR /workspace
USER sandbox
