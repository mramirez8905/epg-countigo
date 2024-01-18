FROM keymetrics/pm2:18-buster

# Set working directory
WORKDIR /usr/app

# Copy all files
COPY ./ ./

# Expose the listening port
EXPOSE 3000

# Run container as non-root (unprivileged) user
# The node user is provided in the Node.js Alpine base image
USER node

# Run npm start script with PM2 when container starts
CMD [ "pm2-runtime", "npm", "--", "start" ]