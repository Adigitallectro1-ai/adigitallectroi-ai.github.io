// DOM Elements
const terminalOutput = document.getElementById('terminal-output');
const commandInput = document.getElementById('command-input');
const typedName = document.getElementById('typed-name');
const currentTime = document.getElementById('current-time');
const themeIndicator = document.getElementById('terminal-theme');
const projectModal = document.getElementById('project-modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.querySelector('.modal-close');

// Global Variables
let commandHistory = [];
let historyIndex = -1;
let isTyping = false;
const typingSpeed = 50; // ms per character

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initTerminal();
    setupEventListeners();
    updateTime();
    setInterval(updateTime, 1000);
});

// Initialize Terminal
function initTerminal() {
    // Type the name animation
    typeText("MASTER - Linux Enthusiast & Web Learner", typedName);
    
    // Focus on input
    commandInput.focus();
    
    // Add initial commands to history
    commandHistory.push('whoami', 'help', 'ls -la');
    historyIndex = commandHistory.length;
    
    // Check for saved theme
    const savedTheme = localStorage.getItem('terminalTheme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIndicator.textContent = '☀️ Light';
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Command input listener
    commandInput.addEventListener('keydown', handleCommandInput);
    
    // Directory listing click listeners
    document.querySelectorAll('.file-item, .dir-item').forEach(item => {
        item.addEventListener('click', () => {
            const command = item.getAttribute('data-command');
            executeCommand(command);
        });
    });
    
    // Modal close listeners
    modalClose.addEventListener('click', () => {
        projectModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            projectModal.style.display = 'none';
        }
    });
    
    // Terminal buttons (visual only for now)
    document.querySelector('.close-btn').addEventListener('click', () => {
        alert("Tombol close hanya visual. Website tidak bisa ditutup 😄");
    });
    
    document.querySelector('.minimize-btn').addEventListener('click', () => {
        alert("Fitur minimize akan datang di update berikutnya!");
    });
    
    document.querySelector('.maximize-btn').addEventListener('click', () => {
        document.querySelector('.terminal').classList.toggle('fullscreen');
    });
    
    // Theme toggle via status bar
    themeIndicator.addEventListener('click', toggleTheme);
}

// Handle Command Input
function handleCommandInput(e) {
    if (e.key === 'Enter') {
        const command = commandInput.value.trim();
        if (command) {
            // Add to history
            commandHistory.push(command);
            historyIndex = commandHistory.length;
            
            // Execute command
            executeCommand(command);
            
            // Clear input
            commandInput.value = '';
        }
    } else if (e.key === 'ArrowUp') {
        // Navigate command history
        e.preventDefault();
        if (commandHistory.length > 0 && historyIndex > 0) {
            historyIndex--;
            commandInput.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        // Navigate command history
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            commandInput.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            commandInput.value = '';
        }
    } else if (e.key === 'Tab') {
        // Simple auto-complete
        e.preventDefault();
        const currentText = commandInput.value;
        const commands = ['ls', 'cat', 'neofetch', 'tree', 'clear', 'help', 'theme', 'whoami'];
        
        for (let cmd of commands) {
            if (cmd.startsWith(currentText)) {
                commandInput.value = cmd;
                break;
            }
        }
    }
}

// Execute Command
function executeCommand(command) {
    // Display the command
    displayCommand(command);
    
    // Process the command
    const cmd = command.split(' ')[0].toLowerCase();
    const args = command.split(' ').slice(1);
    
    switch(cmd) {
        case 'ls':
            handleLsCommand(args);
            break;
        case 'cat':
            handleCatCommand(args);
            break;
        case 'neofetch':
            handleNeofetch();
            break;
        case 'tree':
            handleTreeCommand(args);
            break;
        case './contact.sh':
            handleContact();
            break;
        case 'clear':
            handleClear();
            break;
        case 'theme':
            handleTheme(args);
            break;
        case 'help':
            displayHelp();
            break;
        case 'whoami':
            displayWhoami();
            break;
        case 'ping':
            handlePing(args);
            break;
        default:
            displayError(`Command not found: ${command}. Type 'help' for available commands.`);
    }
    
    // Scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Display Command Line
function displayCommand(command) {
    const commandLine = document.createElement('div');
    commandLine.className = 'command-line';
    commandLine.innerHTML = `
        <span class="prompt">bos@manjaro<span class="prompt-symbol">:</span><span class="prompt-path">~</span><span class="prompt-symbol">$</span></span>
        <span class="command">${command}</span>
    `;
    terminalOutput.insertBefore(commandLine, commandInput.parentElement);
}

// Display Output
function displayOutput(content, isHTML = false) {
    const output = document.createElement('div');
    output.className = 'output';
    
    if (isHTML) {
        output.innerHTML = content;
    } else {
        output.textContent = content;
    }
    
    terminalOutput.insertBefore(output, commandInput.parentElement);
}

// Display Error
function displayError(message) {
    const error = document.createElement('div');
    error.className = 'output error';
    error.innerHTML = `<span style="color: #ff5555;">Error: ${message}</span>`;
    terminalOutput.insertBefore(error, commandInput.parentElement);
}

// Handle LS Command
function handleLsCommand(args) {
    let output = '';
    
    if (args.includes('-la') || args.includes('-l') || args.includes('-a')) {
        output = `
total 28K
drwxr-xr-x  6 bos bos 4.0K Jan  1 00:00 .
drwxr-xr-x  3 bos bos 4.0K Jan  1 00:00 ..
-rw-r--r--  1 bos bos  500 Jan  1 00:00 about.txt
drwxr-xr-x  2 bos bos 4.0K Jan  1 00:00 projects/
drwxr-xr-x  2 bos bos 4.0K Jan  1 00:00 skills/
-rwxr-xr-x  1 bos bos  100 Jan  1 00:00 contact.sh
drwxr-xr-x  2 bos bos 4.0K Jan  1 00:00 blog/
        `;
    } else {
        output = 'about.txt  projects/  skills/  contact.sh  blog/';
    }
    
    displayOutput(output);
}

// Handle CAT Command
function handleCatCommand(args) {
    if (args.length === 0) {
        displayError("Usage: cat <filename>");
        return;
    }
    
    const filename = args[0];
    
    switch(filename) {
        case 'about.txt':
            displayOutput(`
========================================
            ABOUT ME
========================================
Name     : [NAMA ANDA]
Role     : Mahasiswa | Linux Enthusiast
Distro   : Manjaro, Fedora, Ubuntu
Focus    : Linux OS, Web Development
Location : [KOTA ANDA]
========================================
Bio:
Saya adalah mahasiswa yang sangat tertarik 
dengan teknologi open-source, khususnya 
Linux dan pengembangan web. Senang 
mengoprek berbagai distro Linux dan 
membuat proyek web dari nol.

"Linux is not about freedom, it's about 
having full control over your system."
========================================
            `);
            break;
        case 'blog.txt':
            displayOutput(`
========================================
              BLOG
========================================
Coming soon!
Saya akan menulis tentang:
- Pengalaman menggunakan berbagai distro Linux
- Tutorial command line untuk pemula
- Tips optimasi sistem Linux
- Pengembangan web dengan tools open-source
========================================
            `);
            break;
        default:
            displayError(`cat: ${filename}: No such file or directory`);
    }
}

// Handle NEOFETCH Command
function handleNeofetch() {
    const neofetchHTML = `
<div class="neofetch-container">
    <pre class="ascii-art">
        .--.
       |o_o |
       |:_/ |
      //   \ \\
     (|     | )
    /'\\_   _/\`\\
    \\___)=(___/
    </pre>
    <div class="sys-info">
        <p><span style="color: #00ff88;">bos</span>@<span style="color: #00aaff;">portfolio</span></p>
        <p>-------------------------</p>
        <p>OS: Manjaro Linux x86_64</p>
        <p>Host: Custom PC</p>
        <p>Kernel: 6.6.1-1-MANJARO</p>
        <p>Shell: zsh 5.9</p>
        <p>DE: KDE Plasma</p>
        <p>WM: KWin</p>
        <p>Terminal: Konsole</p>
        <p>CPU: AMD Ryzen 5</p>
        <p>Memory: 16GB</p>
        <p>-------------------------</p>
        <p>Skills:</p>
        <p>Linux Fundamentals <span class="progress-bar"><span class="progress-fill" style="width: 80%"></span></span> 80%</p>
        <p>HTML/CSS <span class="progress-bar"><span class="progress-fill" style="width: 70%"></span></span> 70%</p>
        <p>JavaScript <span class="progress-bar"><span class="progress-fill" style="width: 60%"></span></span> 60%</p>
        <p>Git <span class="progress-bar"><span class="progress-fill" style="width: 75%"></span></span> 75%</p>
        <p>VS Code <span class="progress-bar"><span class="progress-fill" style="width: 85%"></span></span> 85%</p>
    </div>
</div>
    `;
    displayOutput(neofetchHTML, true);
}

// Handle TREE Command
function handleTreeCommand(args) {
    if (args.length === 0 || args[0] === 'projects/') {
        const treeHTML = `
<div class="tree-view">
    <p>projects/</p>
    <p>├── <span class="tree-item" onclick="showProject('web-profil')"><span class="tree-icon">📁</span> web-profil/</span></p>
    <p>│   ├── <span style="color: #888;">desc:</span> Website profil terminal-style</p>
    <p>│   ├── <span style="color: #888;">tech:</span> HTML, CSS, JavaScript</p>
    <p>│   └── <span style="color: #00ff88;">status:</span> <span style="color: #00ff88;">✓ Completed</span></p>
    <p>├── <span class="tree-item" onclick="showProject('web-lan')"><span class="tree-icon">📁</span> web-lan-test/</span></p>
    <p>│   ├── <span style="color: #888;">desc:</span> Testing jaringan lokal</p>
    <p>│   ├── <span style="color: #888;">tech:</span> PHP, MySQL, Apache</p>
    <p>│   └── <span style="color: #ffd700;">status:</span> <span style="color: #ffd700;">🔄 In Progress</span></p>
    <p>└── <span class="tree-item" onclick="showProject('linux-setup')"><span class="tree-icon">📁</span> linux-setup/</span></p>
    <p>    ├── <span style="color: #888;">desc:</span> Automation scripts for Linux</p>
    <p>    ├── <span style="color: #888;">tech:</span> Bash, Python</p>
    <p>    └── <span style="color: #00ff88;">status:</span> <span style="color: #00ff88;">✓ Completed</span></p>
</div>
        `;
        displayOutput(treeHTML, true);
    } else {
        displayError(`tree: ${args[0]}: No such file or directory`);
    }
}

// Show Project Details
function showProject(projectId) {
    let projectContent = '';
    
    switch(projectId) {
        case 'web-profil':
            projectContent = `
<h3 style="color: #00ff88;">Web Profil Terminal</h3>
<p><strong>Deskripsi:</strong> Website profil dengan konsep terminal Linux yang interaktif.</p>
<p><strong>Tech Stack:</strong> HTML5, CSS3, Vanilla JavaScript</p>
<p><strong>Fitur:</strong></p>
<ul>
    <li>Interface seperti terminal Linux</li>
    <li>Command-line navigation</li>
    <li>Typing animation</li>
    <li>Responsive design</li>
    <li>Dark/Light mode</li>
</ul>
<p><strong>Status:</strong> <span style="color: #00ff88;">Selesai</span></p>
<p><strong>Link:</strong> <a href="#" style="color: #00aaff;">GitHub Repository</a></p>
            `;
            break;
        case 'web-lan':
            projectContent = `
<h3 style="color: #00ff88;">Web LAN Testing</h3>
<p><strong>Deskripsi:</strong> Aplikasi web untuk testing jaringan lokal (LAN).</p>
<p><strong>Tech Stack:</strong> PHP, MySQL, Apache, JavaScript</p>
<p><strong>Fitur:</strong></p>
<ul>
    <li>Monitoring jaringan</li>
    <li>Speed test internal</li>
    <li>Device discovery</li>
    <li>Network diagnostics</li>
</ul>
<p><strong>Status:</strong> <span style="color: #ffd700;">Dalam Pengembangan</span></p>
<p><strong>Progress:</strong> 60%</p>
            `;
            break;
        case 'linux-setup':
            projectContent = `
<h3 style="color: #00ff88;">Linux Setup Automation</h3>
<p><strong>Deskripsi:</strong> Kumpulan script Bash untuk automasi setup Linux.</p>
<p><strong>Tech Stack:</strong> Bash Script, Python</p>
<p><strong>Fitur:</strong></p>
<ul>
    <li>Auto-install packages</li>
    <li>System configuration</li>
    <li>Backup & restore</li>
    <li>Customization scripts</li>
</ul>
<p><strong>Status:</strong> <span style="color: #00ff88;">Selesai</span></p>
<p><strong>Link:</strong> <a href="#" style="color: #00aaff;">GitHub Repository</a></p>
            `;
            break;
    }
    
    modalBody.innerHTML = projectContent;
    projectModal.style.display = 'flex';
}

// Handle CONTACT Command
function handleContact() {
    const contactHTML = `
<div class="contact-output">
    <p>bos@manjaro:~$ ./contact.sh</p>
    <p>Executing contact script...</p>
    <p style="color: #00ff88;">[ OK ] Script executed successfully</p>
    <br>
    <div class="contact-item">
        <div class="contact-icon"><i class="fas fa-envelope"></i></div>
        <div>
            <strong>Email:</strong> 
            <a href="mailto:bos@example.com" class="contact-link">bos@example.com</a>
        </div>
    </div>
    <div class="contact-item">
        <div class="contact-icon"><i class="fab fa-github"></i></div>
        <div>
            <strong>GitHub:</strong> 
            <a href="https://github.com/username" target="_blank" class="contact-link">github.com/username</a>
        </div>
    </div>
    <div class="contact-item">
        <div class="contact-icon"><i class="fab fa-telegram"></i></div>
        <div>
            <strong>Telegram:</strong> 
            <a href="https://t.me/username" target="_blank" class="contact-link">@username</a>
        </div>
    </div>
    <div class="contact-item">
        <div class="contact-icon"><i class="fas fa-file-pdf"></i></div>
        <div>
            <strong>CV:</strong> 
            <a href="#" class="contact-link">Download CV (PDF)</a>
        </div>
    </div>
    <br>
    <p>Feel free to reach out for collaboration or just to say hi!</p>
</div>
    `;
    displayOutput(contactHTML, true);
}

// Handle PING Command
function handlePing(args) {
    if (args.length === 0) {
        displayError("Usage: ping <hostname>");
        return;
    }
    
    const hostname = args[0];
    displayOutput(`PING ${hostname} (192.168.1.1) 56(84) bytes of data.`);
    
    // Simulate ping responses
    setTimeout(() => {
        displayOutput("64 bytes from bos.dev: icmp_seq=1 ttl=64 time=0.123 ms");
    }, 300);
    
    setTimeout(() => {
        displayOutput("64 bytes from bos.dev: icmp_seq=2 ttl=64 time=0.456 ms");
    }, 600);
    
    setTimeout(() => {
        displayOutput("\n--- bos.dev ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss");
    }, 900);
}

// Handle CLEAR Command
function handleClear() {
    // Remove all outputs except the current input line
    const outputs = terminalOutput.querySelectorAll('.command-line, .output');
    outputs.forEach(output => {
        if (!output.contains(commandInput)) {
            output.remove();
        }
    });
}

// Handle THEME Command
function handleTheme(args) {
    if (args.length === 0 || args[0] === '--toggle') {
        toggleTheme();
    } else if (args[0] === '--light') {
        setLightTheme();
    } else if (args[0] === '--dark') {
        setDarkTheme();
    } else {
        displayError(`theme: invalid option '${args[0]}'\nUsage: theme [--light|--dark|--toggle]`);
    }
}

// Toggle Theme
function toggleTheme() {
    if (document.body.classList.contains('light-theme')) {
        setDarkTheme();
    } else {
        setLightTheme();
    }
}

// Set Light Theme
function setLightTheme() {
    document.body.classList.add('light-theme');
    themeIndicator.textContent = '☀️ Light';
    localStorage.setItem('terminalTheme', 'light');
    displayOutput("Switching to light theme...\n[ OK ] Theme changed successfully");
}

// Set Dark Theme
function setDarkTheme() {
    document.body.classList.remove('light-theme');
    themeIndicator.textContent = '🌙 Dark';
    localStorage.setItem('terminalTheme', 'dark');
    displayOutput("Switching to dark theme...\n[ OK ] Theme changed successfully");
}

// Display HELP
function displayHelp() {
    const helpText = `
Available commands:
ls          - Show directory listing (navigation)
cat about.txt - About me section
neofetch     - Display system/skills info
tree projects/ - View projects
./contact.sh - Contact information
ping [host]  - Test connection
clear       - Clear terminal
theme       - Toggle dark/light mode
help        - Show this help menu
    `;
    displayOutput(helpText);
}

// Display WHOAMI
function displayWhoami() {
    displayOutput("bos - Linux Enthusiast & Web Learner");
}

// Typing Animation
function typeText(text, element) {
    if (isTyping) return;
    
    isTyping = true;
    element.textContent = '';
    let i = 0;
    
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        } else {
            clearInterval(typeInterval);
            isTyping = false;
        }
    }, typingSpeed);
}

// Update Current Time
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    currentTime.textContent = timeString;
}

// Make showProject function globally available
window.showProject = showProject;