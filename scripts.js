document.addEventListener('DOMContentLoaded', (event) => {
    const commandInput = document.getElementById('command-input');
    const output = document.getElementById('output');
    const resetButton = document.getElementById('reset-button');

    let fileSystem = {};

    commandInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const command = commandInput.value.trim();
            if (command) {
                executeCommand(command);
                commandInput.value = '';
            }
        }
    });

    resetButton.addEventListener('click', function () {
        fileSystem = {};
        output.innerHTML = '';
        const resetMessage = document.createElement('div');
        resetMessage.textContent = 'System restarted.';
        output.appendChild(resetMessage);
        output.scrollTop = output.scrollHeight;
    });

    function executeCommand(command) {
        const outputLine = document.createElement('div');
        outputLine.textContent = `C:\\> ${command}`;
        output.appendChild(outputLine);

        const result = document.createElement('div');
        result.textContent = processCommand(command);
        output.appendChild(result);

        output.scrollTop = output.scrollHeight;
    }

    function processCommand(command) {
        const [cmd, ...args] = command.split(' ');
        switch (cmd.toLowerCase()) {
            case 'dir':
                return listFiles();
            case 'help':
                return 'Supported commands: DIR, HELP, ECHO, CREATE, TYPE, DEL, CLS, RESET';
            case 'ping':
                return 'PONG! :3';
            case 'echo':
                return args.join(' ');
            case 'create':
                return createFile(args.join(' '));
            case 'type':
                return openFile(args.join(' '));
            case 'del':
                return deleteFile(args.join(' '));
            case 'cls':
                clearScreen();
                return '';
            default:
                return `'${cmd}' is not recognized as an internal or external command, operable program or batch file.`;
        }
    }

    function listFiles() {
        if (Object.keys(fileSystem).length === 0) {
            return 'No files found.';
        }
        return Object.keys(fileSystem).join('\n');
    }

    function createFile(fileName) {
        if (!fileName) {
            return 'Error: No filename specified.';
        }
        if (fileSystem[fileName]) {
            return `Error: File ${fileName} already exists.`;
        }
        fileSystem[fileName] = '';
        return `File ${fileName} created.`;
    }

    function openFile(fileName) {
        if (!fileName) {
            return 'Error: No filename specified.';
        }
        if (!fileSystem[fileName]) {
            return `Error: File ${fileName} not found.`;
        }
        return fileSystem[fileName];
    }

    function deleteFile(fileName) {
        if (!fileName) {
            return 'Error: No filename specified.';
        }
        if (!fileSystem[fileName]) {
            return `Error: File ${fileName} not found.`;
        }
        delete fileSystem[fileName];
        return `File ${fileName} deleted.`;
    }

    function clearScreen() {
        output.innerHTML = '';
    }
});
