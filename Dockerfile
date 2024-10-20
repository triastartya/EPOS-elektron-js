FROM ubuntu:18.04

RUN apt-get update && apt-get install -y \
    python3 \
    binutils \
    fakeroot rpm \
    curl \
    ca-certificates \
    libnss3 \
    libgtk-3-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libasound2 \
    libatk1.0-0 \
    libpangocairo-1.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libpangoft2-1.0-0 \
    libharfbuzz0b \
    xdg-utils && \
    rm -rf /var/lib/apt/lists/*

# Install Node.js dan npm
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
    apt-get install -y nodejs

# Install Electron dan electron-builder global
RUN npm install -g electron@latest electron-builder