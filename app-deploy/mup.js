
module.exports = {
  servers: {
    one: {
      host: 'specialneighborhood.com',
      username: 'ubuntu',
      pem:'~/new_pair.pem'
      // password:
      // or leave blank for authenticate from ssh-agent
    }
  },

meteor: {
    name: 'special',
    path: '../../special',
    volumes: {
      '/var/www/html/special/public/uploads/': '/var/www/html/special/public/uploads/'
    },
    servers: {
      one: {}
    },

  ssl: {
    crt: "/etc/letsencrypt/live/specialneighborhood.com/fullchain.pem",
    key:"/etc/letsencrypt/live/specialneighborhood.com/privkey.pem",
    port: 443
  },

    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'https://specialneighborhood.com',
      MONGO_URL: 'mongodb://localhost/meteor'
    },
    dockerImage: 'abernix/meteord:node-8.4.0-base',
    deployCheckWaitTime: 60,
     enableUploadProgressBar: true,
  },
mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};