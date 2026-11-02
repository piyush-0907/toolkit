/* Rebuilds every generated page. Run from the project root:  node build/build.js */
["build-pages.js", "build-tools.js", "build-static.js"].forEach(f => require("./" + f));
