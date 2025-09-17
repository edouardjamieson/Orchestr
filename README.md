# 🎭 Orchestr

> **Powerful JSON-based task automation for developers**

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org)

Orchestr transforms complex command sequences into simple, shareable JSON scripts. Automate your development workflow with readable, version-controlled automation scripts that just work.

## ✨ Features

- 📝 **JSON-based scripts** - Human-readable, easy to share and version control
- 🎯 **Conditional execution** - Run actions based on conditions
- 📦 **File operations** - Create, read, update, delete files and directories
- 💬 **Interactive prompts** - Get user input when needed
- 🚀 **Zero configuration** - Works out of the box with npx
- 🔧 **Built-in validation** - Catch errors before execution
- ⚡ **Sequential execution** - Actions run one after another with state persistence

## 🚀 Quick Start

```bash
# Run directly with npx (no installation needed)
npx orchestr@latest <script-name>
```

## 📖 Basic Example

Create a directory `.orchestr/` and add a file `deploy.json`:

```json
{
  "name": "deploy-app",
  "description": "Build and deploy application",
  "actions": [
    {
      "id": "npmBuild",
      "type": "bash",
      "config": {
        "command": "npm run build"
      }
    },
    {
      "id": "npmTest",
      "type": "bash",
      "config": {
        "command": "npm test"
      }
    },
    {
      "id": "confirmTest",
      "type": "input-confirm",
      "config": {
        "message": "Run test command ?"
      }
    }
  ],
  "steps": [
    "npmBuild",
    "confirmTest",
    {
      "if": ["confirmTest", "==", "true"],
      "then": "npmTest"
    }
  ]
}
```

Run it:

```bash
npx orchestr@latest deploy
```

## 📋 Script Structure

### Core Components

| Component     | Description                             |
| ------------- | --------------------------------------- |
| `name`        | Script name (required)                  |
| `description` | Script description (optional)           |
| `args`        | User-provided arguments (optional)      |
| `variables`   | Static values (optional)                |
| `actions`     | Available actions to execute (required) |
| `steps`       | Execution flow (required)               |

### Arguments

Define values users can pass when running the script:

```json
{
  "args": [
    {
      "id": "environment",
      "required": true
    },
    {
      "id": "version",
      "required": false
    }
  ]
}
```

Usage: `npx orchestr@latest deploy --environment=production --version=1.2.0`

### Variables

Static values available throughout the script:

```json
{
  "variables": {
    "buildPath": "./dist",
    "apiUrl": "https://api.example.com"
  }
}
```

### Steps

Define the execution flow with conditions:

```json
{
  "steps": [
    "actionId1",
    "actionId2",
    {
      "if": ["actionId2", "==", "success"],
      "then": "actionId3"
    }
  ]
}
```

## 🎯 Actions Reference

### Input Actions

#### `input-text` - Text Input

Get text input from user.

```json
{
  "id": "userName",
  "type": "input-text",
  "config": {
    "message": "Enter your name:",
    "required": true,
    "default": "Anonymous",
    "mask": false
  }
}
```

#### `input-confirm` - Yes/No Confirmation

Get boolean confirmation from user.

```json
{
  "id": "confirmDeploy",
  "type": "input-confirm",
  "config": {
    "message": "Deploy to production?"
  }
}
```

#### `input-choice` - Multiple Choice

Let user select from predefined options.

```json
{
  "id": "environment",
  "type": "input-choice",
  "config": {
    "message": "Select environment:",
    "multiple": false,
    "required": true,
    "choices": {
      "dev": "Development",
      "staging": "Staging",
      "prod": "Production"
    }
  }
}
```

### File Actions

#### `file-create` - Create File

Create a new file with content.

```json
{
  "id": "createEnv",
  "type": "file-create",
  "config": {
    "path": ".env.production",
    "content": "NODE_ENV=production\nAPI_URL=https://api.example.com",
    "mode": "644"
  }
}
```

#### `file-read` - Read File

Read file contents.

```json
{
  "id": "readConfig",
  "type": "file-read",
  "config": {
    "path": "./config.json"
  }
}
```

#### `file-update` - Update File

Update existing file content.

```json
{
  "id": "updatePackage",
  "type": "file-update",
  "config": {
    "path": "./package.json",
    "content": "{ \"version\": \"1.2.0\" }",
    "overwrite": true
  }
}
```

#### `file-delete` - Delete File

Delete a file.

```json
{
  "id": "cleanupTemp",
  "type": "file-delete",
  "config": {
    "path": "./temp-file.txt"
  }
}
```

#### `file-move` - Move File

Move or rename a file.

```json
{
  "id": "moveBuild",
  "type": "file-move",
  "config": {
    "path": "./dist",
    "destination": "./build"
  }
}
```

### Directory Actions

#### `directory-create` - Create Directory

Create a new directory.

```json
{
  "id": "createDist",
  "type": "directory-create",
  "config": {
    "path": "./dist",
    "mode": "755"
  }
}
```

#### `directory-delete` - Delete Directory

Delete a directory.

```json
{
  "id": "cleanDist",
  "type": "directory-delete",
  "config": {
    "path": "./dist"
  }
}
```

### Operation Actions

#### `bash` - Execute Shell Commands

Run shell commands.

```json
{
  "id": "runTests",
  "type": "bash",
  "config": {
    "command": "npm test"
  }
}
```

#### `message` - Display Message

Show a message to the user.

```json
{
  "id": "showSuccess",
  "type": "message",
  "config": {
    "message": "✅ Build completed successfully!"
  }
}
```

## 💡 Examples

### Simple Build Script

```json
{
  "name": "build-project",
  "description": "Build the project with optional testing",
  "actions": [
    {
      "id": "install",
      "type": "bash",
      "config": {
        "command": "npm install"
      }
    },
    {
      "id": "build",
      "type": "bash",
      "config": {
        "command": "npm run build"
      }
    },
    {
      "id": "askTest",
      "type": "input-confirm",
      "config": {
        "message": "Run tests after build?"
      }
    },
    {
      "id": "test",
      "type": "bash",
      "config": {
        "command": "npm test"
      }
    }
  ],
  "steps": [
    "install",
    "build",
    "askTest",
    {
      "if": ["askTest", "is-true"],
      "then": "test"
    }
  ]
}
```

### Environment Setup

```json
{
  "name": "setup-env",
  "description": "Setup environment configuration",
  "args": [
    {
      "id": "env",
      "required": true
    }
  ],
  "variables": {
    "configPath": "./.env"
  },
  "actions": [
    {
      "id": "selectEnv",
      "type": "input-choice",
      "config": {
        "message": "Select environment:",
        "choices": {
          "dev": "Development",
          "prod": "Production"
        }
      }
    },
    {
      "id": "createEnvFile",
      "type": "file-create",
      "config": {
        "path": ".env",
        "content": "NODE_ENV={{env}}\nAPI_URL=https://{{env}}.api.example.com"
      }
    },
    {
      "id": "showComplete",
      "type": "message",
      "config": {
        "message": "Environment setup complete for {{env}}"
      }
    }
  ],
  "steps": ["selectEnv", "createEnvFile", "showComplete"]
}
```

## 🔧 CLI Usage

```bash
# Run a script
npx orchestr@latest <script-name>

# Run with arguments
npx orchestr@latest deploy --environment=production --version=1.2.0

# Validate a script
npx orchestr@latest validate deploy --environment=production --version=1.2.0

# List available scripts
npx orchestr@latest list

# Show help
npx orchestr@latest help
```

## 📁 Script Organization

Orchestr automatically discovers scripts in the `.orchestr/` directory:

```bash
project/
├── .orchestr/
│   ├── build.json
│   ├── test.json
│   ├── deploy.json
│   └── setup.json
├── src/
└── package.json
```

## 💡 Key Concepts

- **Sequential Execution**: Actions run one after another, not in parallel
- **State Persistence**: Each action's return value is saved and can be referenced by its ID
- **Unique IDs**: Args, variables, and actions must have unique IDs
- **Conditional Flow**: Use if/then statements to create conditional execution paths
- **NPX First**: Designed to be used via npx, not installed globally or per-project

## 📄 License

MIT © Édouard Jamieson

---

<p align="center">
  Made with ❤️ by developers, for developers
</p>
