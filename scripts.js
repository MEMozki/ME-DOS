document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const prompt = document.getElementById('prompt');
    const fileSystem = {
        'system': 'You cannot delete or modify this file.'
    };

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const command = input.value;
            input.value = '';
            output.innerHTML += `<div>${prompt.innerHTML} ${command}</div>`;
            executeCommand(command);
            output.scrollTop = output.scrollHeight;
        }
    });

    function executeCommand(command) {
        const [cmd, ...args] = command.split(' ');
        let response = '';

        switch (cmd.toLowerCase()) {
            case 'dir':
                response = ' Volume in drive C has no label.\n Directory of C:\\\n\n';
                for (const file in fileSystem) {
                    response += `${file}\n`;
                }
                response += '\n           0 bytes free';
                break;
            case 'help':
                response = 'Supported commands: DIR, HELP, CLS, ECHO, CREATE, DELETE, OPEN, REBOOT';
                break;
            case 'cls':
                output.innerHTML = '';
                response = '';
                break;
            case 'echo':
                response = args.join(' ');
                break;
            case 'create':
                if (args.length > 0) {
                    const fileName = args[0];
                    if (!fileSystem[fileName]) {
                        fileSystem[fileName] = '';
                        response = `File ${fileName} created.`;
                    } else {
                        response = `File ${fileName} already exists.`;
                    }
                } else {
                    response = 'Usage: CREATE <filename>';
                }
                break;
            case 'delete':
                if (args.length > 0) {
                    const fileName = args[0];
                    if (fileSystem[fileName] && fileName !== 'system') {
                        delete fileSystem[fileName];
                        response = `File ${fileName} deleted.`;
                    } else {
                        response = `File ${fileName} does not exist or cannot be deleted.`;
                    }
                } else {
                    response = 'Usage: DELETE <filename>';
                }
                break;
            case 'open':
                if (args.length > 0) {
                    const fileName = args[0];
                    if (fileSystem[fileName]) {
                        response = `Opening ${fileName}:\n${fileSystem[fileName]}`;
                    } else {
                        response = `File ${fileName} does not exist.`;
                    }
                } else {
                    response = 'Usage: OPEN <filename>';
                }
                break;
            case 'reboot':
                response = 'Rebooting MS-DOS emulator...';
                setTimeout(() => {
                    location.reload();
                }, 1000);
                break;
            default:
                response = `'${cmd}' is not recognized as an internal or external command,\noperable program or batch file.`;
                break;
        }

        if (response) {
            output.innerHTML += `<div>${response}</div>`;
        }
    }
});
