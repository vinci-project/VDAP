module.exports = {
  apps: [
    {
      name: 'Front Server',
      script: './src/server/index.js'
    },
    {
      name: 'Stem',
      script: './src/stem/vdap.js'
    },
    {
      name: 'Storage',
      script: './src/storage/index.js',
      args:
        '--port=9000,9001 --id=fb99337c-1bbb-4e45-8e52-2f951776f313,040c5160-8a22-4a0b-9aa8-efa15614ed03'
    },
    {
      name: 'Blockchain',
      script: './src/blockchain-sim/index.js'
    }
  ]
};
