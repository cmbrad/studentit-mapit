## MapIT - Library electronic resource map
### Description
Polymer based web application which hooks into MYPC's BookIT API in order to display interactive maps and statistics
pertaining to device usage and location.
The app can display the location and usage status of every computer and project room in the University of Melbourne's Parkville and Southbank campus libraries.

### Browser Compatibility
Firefox (version?)
Chrome (version?)
Edge (version?)
Safari (version?)

Incompatible with all versions of Internet Explorer.

## Installation
### Prerequisites
- Node.js, used to run JavaScript tools from the command line.
- npm, the node package manager, installed with Node.js and used to install Node.js packages.
- gulp, a Node.js-based build tool.
- bower, a Node.js-based package manager used to install front-end packages (like Polymer).

### Components
```sh
npm install && bower install
```

## Usage
## Build & Vulcanize

```sh
gulp
```

### Serve / watch

```sh
gulp serve
```

This outputs an IP address you can use to locally test and another that can be used on devices connected to your network.

## Testing

```sh
gulp test:local
```

This runs the unit tests defined in the `app/test` directory through [web-component-tester](https://github.com/Polymer/web-component-tester).

To run tests Java 7 or higher is required. To update Java go to http://www.oracle.com/technetwork/java/javase/downloads/index.html and download ***JDK*** and install it.

