#!/usr/bin/env node

const cli = require('./utils/cli');
const encrypt = require('./utils/encrypt');
const decrypt = require('./utils/decrypt');

const input = cli.input;
const flags = cli.flags;

(
    async () => {
        console.log("👋 Welcome to image encryption tool 👋");

        input.includes('help') && cli.showHelp(0);;
        if (flags.encrypt) {
            await encrypt(flags);
        } else if (flags.decrypt) {
            await decrypt(flags);
        }

        console.log("\n The program is finished");
    }
)();