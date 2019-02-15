const { spawn } = require('child_process');
const chalk = require('chalk');

let started;
module.exports = function startRenderer() {
    return new Promise((resolve) => {
        const rendererProcess = spawn('npm', [
            "run",
            "start:renderer"
        ]);

        rendererProcess.stdout.on('data', data => {
            let str = data.toString();
            if (!started && str.includes('Compiled successfully!')) {
                started = true;
                resolve();
            }
            console.log(chalk.green(str));
        });

        rendererProcess.stderr.on('data', data => {
            let str = data.toString();
            console.log(chalk.red(str));
        });
    });
};
