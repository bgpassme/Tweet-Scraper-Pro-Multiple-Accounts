import chalk from 'chalk';

class Logger {
  static timestamp() {
    return new Date().toISOString();
  }

  static info(message) {
    console.log(chalk.blue(`[${this.timestamp()}] INFO: ${message}`));
  }

  static success(message) {
    console.log(chalk.green(`[${this.timestamp()}] SUCCESS: ${message}`));
  }

  static warn(message) {
    console.log(chalk.yellow(`[${this.timestamp()}] WARNING: ${message}`));
  }

  static error(message) {
    console.log(chalk.red(`[${this.timestamp()}] ERROR: ${message}`));
  }

  static debug(message) {
    if (process.env.DEBUG) {
      console.log(chalk.gray(`[${this.timestamp()}] DEBUG: ${message}`));
    }
  }

  static startSpinner(message) {
    console.log(chalk.cyan(`[${this.timestamp()}] ${message}...`));
  }

  static stopSpinner(success = true) {
    if (success) {
      console.log(chalk.green(`[${this.timestamp()}] Done!`));
    }
  }
}

export default Logger;