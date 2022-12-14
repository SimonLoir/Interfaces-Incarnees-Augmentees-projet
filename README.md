# IronProf

This project uses [turborepo](https://turborepo.org/). It also requires node.js version 16 or higher.

```bash
nvm use 16
```

## Install packages

This project uses npm as a package manager. To install all packages, run:

```bash
npm install
```

If you want to install packages for a specific workspace, run:

```bash
npm install [package_name] --workspace=apps/[app_name]
```

## Start all projects

```bash
npm run dev
```

## Start the IronProf server

The main server runs on port 3001. To start it, run:

```bash
npm run dev:main
```

## Start the IronProf client

The client runs on port 3000. To start it, run:

```bash
npm run dev:agent
```

## Packages directory

The packages directory contains the packages that are common to multiple workspaces. For example, the `@utils/global` package is used by both the `server` and `agent-gui` workspaces. The `@utils/global` package contains common functions and hooks that are used by both workspaces.

## Custom environment variables

You can create `apps/agent/.env.local` and `apps/server/.env.local` files to override environment variables. For example, you can create `apps/agent/.env.local` and add the following line to it:

```bash
ELECTRON=true
```

This will enable the Electron version of the agent.

You can also use `NEXT_PUBLIC_SERVER_HOST`, `NEXT_PUBLIC_SERVER_PORT`, `NEXT_PUBLIC_PEER_HOST` and `NEXT_PUBLIC_PEER_PORT` to override the default server and peer host and port.
