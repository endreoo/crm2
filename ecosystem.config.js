module.exports = {
  apps: [{
    name: 'crm-hotelonline',
    script: 'npm',
    args: 'run dev',
    env: {
      NODE_ENV: 'production',
      PORT: '5174'
    },
    watch: false,
    instances: 1,
    autorestart: true,
    max_memory_restart: '1G'
  }]
}; 