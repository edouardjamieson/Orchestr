import chalk from 'chalk';
import { existsSync, readdirSync } from 'fs';
import path from 'path';

export default class Utils {
  static BASE_PATH = '.orchestr';

  static commonMetaDirectories = [
    // Version Control
    '.git',
    '.svn',
    '.hg',
    '.bzr',
    '.cvs',

    // Dependencies & Package Management
    'node_modules',
    'vendor',
    'bower_components',
    '.npm',
    '.yarn',
    '.pnpm-store',
    'packages',
    'jspm_packages',
    '.cargo',
    'target',
    'pkg',

    // Python
    '__pycache__',
    'venv',
    'env',
    '.venv',
    '.env',
    'virtualenv',
    'pipenv',
    '.tox',
    'dist',
    'build',
    '.pytest_cache',
    '.mypy_cache',
    '.ruff_cache',

    // Java/JVM
    '.gradle',
    '.m2',
    'out',

    // .NET/C#
    'bin',
    'obj',
    'packages',
    '.vs',
    '_ReSharper',

    // Ruby
    '.bundle',
    'vendor/bundle',

    // Build Outputs
    '.next',
    '.nuxt',
    '.output',
    'public/build',
    '.parcel-cache',
    '.vite',
    '.turbo',
    '.vercel',
    '.netlify',
    'output',

    // IDE/Editor
    '.vscode',
    '.idea',
    '.settings',
    '.atom',
    '.fleet',

    // OS Files
    '.Trash-',
    '.Spotlight-V100',
    '.Trashes',

    // Logs & Cache
    'logs',
    'tmp',
    'temp',
    'cache',
    '.cache',
    '.sass-cache',

    // Documentation/Coverage
    'coverage',
    '.nyc_output',
    'htmlcov',

    // Mobile Development
    'Pods',

    // Security Sensitive
    '.secrets',
    'credentials',
  ];

  static commonMetaFiles = [
    // Python
    '.pyc',
    '.pyo',
    '.pyd',
    '.Python',
    '.egg-info',

    // Java/JVM
    '.class',
    '.jar',
    '.war',
    '.ear',

    // .NET/C#
    '.dll',
    '.exe',
    '.pdb',
    '.suo',
    '.user',

    // Ruby
    '.ruby-version',
    '.ruby-gemset',

    // IDE/Editor
    '.swp',
    '.swo',
    '.project',
    '.classpath',
    '.sublime-',

    // OS Files
    '.DS_Store',
    'Thumbs.db',
    'desktop.ini',
    '.tmp',
    '.temp',

    // Logs & Cache
    '.eslintcache',

    // Documentation/Coverage
    '.cover',
    '.coverage',
    'lcov.info',

    // Database
    '.sqlite',
    '.db',
    '.sqlite3',
    '.mdb',

    // Large Binary Files
    '.iso',
    '.dmg',
    '.pkg',

    // Mobile Development
    '.ipa',
    '.apk',
    '.aab',
  ];

  static validateStructure() {
    const _path = path.join(process.cwd(), this.BASE_PATH);
    if (!existsSync(_path)) {
      this.logError(
        `We could not find the ${this.BASE_PATH} directory. Make sure it exists before launching scripts.`
      );
      process.exit(1);
    }
    return true;
  }

  static logError(message: string) {
    console.log(chalk.red.bold(message));
  }

  static logWarning(message: string) {
    console.log(chalk.yellow.bold(message));
  }

  static logSuccess(message: string) {
    console.log(chalk.green.bold(message));
  }

  static clearConsole() {
    const lines = process.stdout.getWindowSize()[1];
    for (var i = 0; i < lines; i++) {
      console.log('\r\n');
    }
  }

  static parseVariableMessage(
    message: string,
    options: { id: string; value: string }[]
  ) {
    return message.replace(/{{(.*?)}}/g, (match, p1) => {
      const value = options.find(o => o.id === p1)?.value;
      if (value === undefined) {
        return match;
      }
      return value;
    });
  }

  static scanDirectory(
    dirPath: string,
    term: string,
    includeDirs: boolean = false,
    dirsToIgnore: string[] = this.commonMetaDirectories,
    filesToIgnore: string[] = this.commonMetaFiles
  ): { path: string; isFile: boolean }[] {
    const results: { path: string; isFile: boolean }[] = [];

    try {
      const entries = readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = `${dirPath}/${entry.name}`;

        if (entry.isDirectory()) {
          // Skip ignored directories
          if (dirsToIgnore.includes(entry.name)) {
            continue;
          }

          if (includeDirs) {
            results.push({ path: fullPath, isFile: false });
          }

          // Recursively scan subdirectory
          results.push(
            ...this.scanDirectory(
              fullPath,
              term,
              includeDirs,
              dirsToIgnore,
              filesToIgnore
            )
          );
        } else if (entry.isFile()) {
          if (filesToIgnore.includes(entry.name)) {
            continue;
          }

          // Add file if it matches the search term
          if (!term || fullPath.includes(term)) {
            results.push({ path: fullPath, isFile: true });
          }
        }
      }
    } catch (error) {
      // Silently skip directories that can't be read
    }

    return results;
  }
}
