Neon is a library for running javascript in C# applications based on ClearScript.
The advantage over using ClearScript instead is that Neon comes with more advanced host features such as support for ES Modules, package.json, node_modules, jsx etc acheiving a more batteries included experience for running javascript in C# applications.
This isn't to say that Clearscript is inferior. Clearscript is meant to be a low level library. Neon is a high level library that builds on top of Clearscript.

Note that Neon does not provide the nodejs standard library so node_modules that rely on nodejs builtins will not work out of the box.
A standard library that is Node compatible may come piecemeal in the future.

Neon is fully sandboxed by default and code running in Neon cannot access the filesystem, network or any other system resources unless opted in by the host application.

## Feature Matrix

This table shows the differences between ClearScript and Neon. Helping you decide which library to use.

| Feature                    | ClearScript | Neon   |
| -------------------------- | ----------- | ------ |
| Built in Import ES Modules | No          | Yes    |
| Built in Import CommonJS   | No          | No     |
| Support package.json       | No          | Yes    |
| Support node_modules       | No          | Yes    |
| Support JSX                | No          | Yes    |
| Support TypeScript         | No          | Yes\*1 |
| Event Loop                 | No          | Yes    |
| Nodejs compatibility       | No          | No     |
| Thread blocking protection | No          | Yes\*2 |

\*1 Transpile only. No type checking.

\*2 Neon has a feature to configure a timeout for how long a script can block the thread. If exceeded, the script is terminated.
