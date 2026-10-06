FROM cypress/included:16.1.1
WORKDIR /e2e
ENV CYPRESS_INSTALL_BINARY=0
COPY e2e/package.json e2e/package-lock.json ./
RUN npm ci
COPY e2e/ ./
ENTRYPOINT ["npm", "test", "--"]
