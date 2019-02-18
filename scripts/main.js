const { spawn } = require('child_process');
const TscWatchClient = require('tsc-watch/client');
const chalk = require('chalk');
const npm = require('./npm.js');
const watch = new TscWatchClient.constructor();

let mainProcess;


function startElectron() {
    if (mainProcess && mainProcess.pid) {
        mainProcess.kill();
        mainProcess = null;
    }
    mainProcess = spawn(npm, [
        "run",
        "start:main"
    ], {
        cwd: __dirname
    });

    mainProcess.stdout.on('data', data => {
        let str = data.toString();
        console.log(chalk.green(str));
    });

    mainProcess.stderr.on('data', data => {
        let str = data.toString();
        console.log(chalk.red(str));
    });
}

module.exports = function startMain() {
    return new Promise((resolve) => {
        watch.on('first_success', () => {
            console.log(chalk.green('tsc-watch started!'));
            startElectron();
            resolve();
        });
        
        watch.on('subsequent_success', () => {
            console.log(chalk.green('reload electron!'));
            startElectron();
        });
        
        watch.on('compile_errors', (e) => {
            if (e) {
                console.log(chalk.red(e.toString()));
            }
            // Your code goes here...
        });
        
        watch.start('--compiler', 'typescript/bin/tsc', '-p', './tsconfig.main.json');
    });
};
