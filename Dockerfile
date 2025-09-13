# 1. Use an official Python runtime as a parent image
FROM python:3.11-slim as builder

# 2. Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_HOME="/opt/poetry"

# 3. Install poetry
RUN apt-get update && apt-get install -y curl && \
    curl -sSL https://install.python-poetry.org | python - && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

# 4. Set the working directory
WORKDIR /app

# 5. Copy dependency definition files and install dependencies
COPY pyproject.toml poetry.lock ./
RUN poetry install --no-dev --no-root

# --- Final Stage ---
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /app

# Copy the virtual environment from the builder stage
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# Copy the application source code
COPY src/ ./src

# The container can be used to run scripts, e.g.:
# docker run --rm -it agentic-layer python -c "from src.agentic import planner; print(planner)"
CMD ["python"]
