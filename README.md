# YAMLNav

YAMLNav is simple utility that let you search through yaml file by path with fuzzy finder and to copy the yaml path
under the cursor.
## Features

**Search**

Find a specific key by search by the entire path.

![YAMLNav Search](images/search.gif)

**Copy**

Copy the path under the cursor.

![YAMLNav Copy](images/copy.gif)
## Requirements

Right now use the yaml-path binary to parse and extract paths. The binary need to be installed with the following command.

```bash
git clone git@github.com:aubinlrx/yaml-path.git
cd yaml-path
go install
```
