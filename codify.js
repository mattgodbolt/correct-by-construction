(function () {
    const ce_nodes = document.querySelectorAll('code.cpp');

    function process(source) {
        const display = [];
        const compile = []
        display.push("<a href=moo>moo</a>");
        for (const line of source.split("\n")) {
            display.push(line); // TODO escape?
        }
        return {
            display: display.join("\n"),
            compile: compile.join("\n")
        };
    }

    for (let i = 0, len = ce_nodes.length; i < len; i++) {
        const element = ce_nodes[i];
        // let compiler = "g82";
        // let options = "-O2 -march=haswell";
        const source = unescape(element.textContent);
        const {display, compile} = process(source);
        element.innerHTML = display;
        // let lines = source.split('\n');
        // source = "";
        // let displaySource = "";
        // const configMatcher = /^\s*\/\/\/\s*([^:]+):(.*)$/;
        // const hideMatcher = /^\s*\/\/\/\s*((un)?hide)$/;
        // let skipDisplay = false;
        // let hide = false;
        // for (let idx = 0; idx < lines.length; ++idx) {
        //     let line = lines[idx];
        //     let match = line.match(configMatcher);
        //     if (match) {
        //         compiler = match[1];
        //         options = match[2];
        //     } else {
        //         match = line.match(hideMatcher);
        //         if (match) {
        //             hide = match[1] === "hide";
        //             continue;
        //         }
        //         if (line === "// setup") {
        //             skipDisplay = true;
        //         } else if (line[0] !== ' ') {
        //             skipDisplay = false;
        //         }
        //
        //         source += line + "\n";
        //         if (!skipDisplay && !hide)
        //             displaySource += line + "\n"
        //         if (line.length > 36) {
        //             console.error(`Line too long: "${line}"`);
        //         }
        //     }
        // }

        function trim(source) {
            while (source.startsWith("\n")) {
                source = source.slice(1, source.length);
            }
            while (source.endsWith("\n\n")) {
                source = source.slice(0, source.length - 1);
            }
            return source;
        }

        // displaySource = trim(displaySource);
        // element.textContent = displaySource;
    }
})();
