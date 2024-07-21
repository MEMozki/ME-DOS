document.addEventListener('DOMContentLoaded', (event) => {
    const commandInput = document.getElementById('command-input');
    const output = document.getElementById('output');
    const resetButton = document.getElementById('reset-button');
    const promptElement = document.getElementById('prompt');

    let fileSystem = { 'C:': {} };
    let currentDir = 'C:';

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
        formatSystem();
    });

    function executeCommand(command) {
        const outputLine = document.createElement('div');
        outputLine.textContent = `${currentDir}> ${command}`;
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
                return showHelp();
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
            case 'format':
                formatSystem();
                return 'System formatted.';
            case 'cd':
                return changeDirectory(args.join(' '));
            case 'mkdir':
                return createDirectory(args.join(' '));
            case 'rename':
                return renameFileOrDirectory(args[0], args[1]);
            case 'rmdir':
                return removeDirectory(args.join(' '));
            case 'copy':
                return copyFile(args[0], args[1]);
            case 'move':
                return moveFile(args[0], args[1]);
            case 'attrib':
                return 'The ATTRIB command is not implemented in this emulator.';
            case 'ping':
                return pingServer(args[0]);
            case 'hidden':
                return 'You found a hidden command!';
            case 'secret':
                return 'This is a secret command!';
            case 'easteregg':
                return 'Congratulations! You discovered an Easter egg!';
            default:
                return `'${cmd}' is not recognized as an internal or external command, operable program or batch file.`;
        }
    }

    function listFiles() {
        const entries = Object.entries(getCurrentDirectory());
        if (entries.length === 0) {
            return 'No files or directories found.';
        }
        return entries.map(([name, value]) => `${name}${typeof value === 'object' ? '/' : ''}`).join('\n');
    }

    function createFile(fileName) {
        if (!fileName) {
            return 'Error: No filename specified.';
        }
        const dir = getCurrentDirectory();
        if (dir[fileName]) {
            return `Error: File or directory ${fileName} already exists.`;
        }
        dir[fileName] = '';
        return `File ${fileName} created.`;
    }

    function openFile(fileName) {
        if (!fileName) {
            return 'Error: No filename specified.';
        }
        const dir = getCurrentDirectory();
        if (!dir[fileName]) {
            return `Error: File ${fileName} not found.`;
        }
        if (typeof dir[fileName] === 'object') {
            return `Error: ${fileName} is a directory.`;
        }
        return `Contents of ${fileName}: ${dir[fileName]}`;
    }

    function deleteFile(fileName) {
        if (!fileName) {
            return 'Error: No filename specified.';
        }
        const dir = getCurrentDirectory();
        if (!dir[fileName]) {
            return `Error: File or directory ${fileName} not found.`;
        }
        delete dir[fileName];
        return `File or directory ${fileName} deleted.`;
    }

    function clearScreen() {
        output.innerHTML = '';
    }

    function formatSystem() {
        fileSystem = { 'C:': {} };
        currentDir = 'C:';
        clearScreen();
        const resetMessage = document.createElement('div');
        resetMessage.textContent = 'System formatted.';
        output.appendChild(resetMessage);
        output.scrollTop = output.scrollHeight;
        showStartupMessage();
    }

    function changeDirectory(dirName) {
        if (!dirName) {
            return 'Error: No directory specified.';
        }
        const dir = getCurrentDirectory();
        if (dirName === '..') {
            if (currentDir === 'C:') {
                return 'Already at root directory.';
            }
            currentDir = currentDir.substring(0, currentDir.lastIndexOf('\\'));
            promptElement.textContent = `${currentDir}>`;
            return `Changed to directory ${currentDir}`;
        }
        if (!dir[dirName] || typeof dir[dirName] !== 'object') {
            return `Error: Directory ${dirName} not found.`;
        }
        currentDir = `${currentDir}\\${dirName}`;
        promptElement.textContent = `${currentDir}>`;
        return `Changed to directory ${currentDir}`;
    }

    function createDirectory(dirName) {
        if (!dirName) {
            return 'Error: No directory name specified.';
        }
        const dir = getCurrentDirectory();
        if (dir[dirName]) {
            return `Error: File or directory ${dirName} already exists.`;
        }
        dir[dirName] = {};
        return `Directory ${dirName} created.`;
    }

    function renameFileOrDirectory(oldName, newName) {
        if (!oldName || !newName) {
            return 'Error: Missing old or new name.';
        }
        const dir = getCurrentDirectory();
        if (!dir[oldName]) {
            return `Error: File or directory ${oldName} not found.`;
        }
        if (dir[newName]) {
            return `Error: File or directory ${newName} already exists.`;
        }
        dir[newName] = dir[oldName];
        delete dir[oldName];
        return `Renamed ${oldName} to ${newName}.`;
    }

    function removeDirectory(dirName) {
        if (!dirName) {
            return 'Error: No directory name specified.';
        }
        const dir = getCurrentDirectory();
        if (!dir[dirName] || typeof dir[dirName] !== 'object') {
            return `Error: Directory ${dirName} not found.`;
        }
        if (Object.keys(dir[dirName]).length > 0) {
            return `Error: Directory ${dirName} is not empty.`;
        }
        delete dir[dirName];
        return `Directory ${dirName} deleted.`;
    }

    function copyFile(source, destination) {
        if (!source || !destination) {
            return 'Error: Missing source or destination.';
        }
        const dir = getCurrentDirectory();
        if (!dir[source]) {
            return `Error: File or directory ${source} not found.`;
        }
        if (dir[destination]) {
            return `Error: File or directory ${destination} already exists.`;
        }
        dir[destination] = dir[source];
        return `Copied ${source} to ${destination}.`;
    }

    function moveFile(source, destination) {
        if (!source || !destination) {
            return 'Error: Missing source or destination.';
        }
        const dir = getCurrentDirectory();
        if (!dir[source]) {
            return `Error: File or directory ${source} not found.`;
        }
        if (dir[destination]) {
            return `Error: File or directory ${destination} already exists.`;
        }
        dir[destination] = dir[source];
        delete dir[source];
        return `Moved ${source} to ${destination}.`;
    }

    function pingServer(server) {
        if (!server) {
            return 'Error: No server specified.';
        }
        const start = Date.now();
        return new Promise(resolve => {
            setTimeout(() => {
                const end = Date.now();
                const time = end - start;
                resolve(`Reply from ${server}: time=${time}ms`);
            }, Math.random() * 1000);
        });
    }

    function getCurrentDirectory() {
        return currentDir.split('\\').reduce((dir, part) => dir[part], fileSystem);
    }

    function showStartupMessage() {
        const startupMessage = `
Create: MEMozki | Tg: MEMozkii
The virtual machine is running.

C:\\>_`;
        const startupLines = startupMessage.split('\n');
        startupLines.forEach(line => {
            const div = document.createElement('div');
            div.textContent = line;
            output.appendChild(div);
        });
    }

    function showHelp() {
        const helpMessage = `
Supported commands:
DIR - List files and directories
HELP - Show this help message
ECHO - Display messages
CREATE - Create a file
TYPE - Display file contents
DEL - Delete a file or directory
CLS - Clear the screen
FORMAT - Format the system
CD - Change directory
MKDIR - Create a directory
RENAME - Rename a file or directory
RMDIR - Remove a directory
COPY - Copy a file
MOVE - Move a file
PING - Ping a server and show response time
    `;
        return helpMessage;
    }

    // Show startup message when the page loads
    showStartupMessage();
});
