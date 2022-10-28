# IronProf Student app

## Environment

The environnement variables can be defined in the `.env.local` file in the `apps/agent` directory.

```bash
ELECTRON=false (default) | true # Whether to start the electron wrapper or not.
NEXT_PUBLIC_SERVER_HOST=localhost | <server-host:string> # The host of the teacher app.
NEXT_PUBLIC_SERVER_PORT=3001 | <server-port:number> # The port of the teacher app.
NEXT_PUBLIC_PEER_HOST=localhost | <peer-host:string> # The host of the peer server (usually the same as the teacher server).
NEXT_PUBLIC_PEER_PORT=3002 | <peer-port:int> # The port of the peer server.
```
