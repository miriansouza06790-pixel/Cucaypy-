import { ProjectFile } from './types';

export const INITIAL_FILES: ProjectFile[] = [
    {
        name: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="Jose Divino Prado da Lapa">
    <title>Cucaypy Workspace</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Toast Container -->
    <div id="toast-container"></div>

    <!-- Terminal Overlay (Server Console) -->
    <div id="server-terminal" class="terminal-overlay" style="display: none;">
        <div class="terminal-header">
            <div class="term-title"><i class="fa-solid fa-terminal"></i> Cucaypy Server v1.0</div>
            <button onclick="toggleTerminal()" class="term-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="terminal-body" id="term-output">
            <div class="term-line"><span class="term-green">root@cucaypy:~$</span> <span class="typing-cursor">_</span></div>
        </div>
    </div>

    <!-- Context Menu (Visual Editor - Double Tap) -->
    <div id="context-menu" class="context-menu" style="display: none;">
        <div class="context-header">Cucaypy Visual</div>
        <div class="context-body">
            <button onclick="executeVisualAction('paste')" class="ctx-btn primary"><i class="fa-solid fa-paste"></i> Colar Banner 3D</button>
            <button onclick="executeVisualAction('edit')" class="ctx-btn"><i class="fa-solid fa-pen"></i> Editar Texto</button>
            <button onclick="executeVisualAction('delete')" class="ctx-btn delete"><i class="fa-solid fa-trash"></i> Excluir Item</button>
        </div>
    </div>

    <div class="app-container">
        <!-- Sidebar Navigation -->
        <aside class="sidebar">
            <div class="brand">
                <div class="brand-icon"><i class="fa-solid fa-cube"></i></div>
                <span id="brand-name">Cucaypy</span>
            </div>
            
            <nav class="nav-menu">
                <a href="javascript:void(0)" class="nav-item active" id="nav-dashboard" onclick="selectTab('dashboard')">
                    <i class="fa-solid fa-grid-2"></i>
                    <span>Início</span>
                </a>
                <a href="javascript:void(0)" class="nav-item" id="nav-editor" onclick="selectTab('editor')">
                    <i class="fa-solid fa-code"></i>
                    <span>Editor</span>
                </a>
                <a href="javascript:void(0)" class="nav-item" id="nav-files" onclick="selectTab('files')">
                    <i class="fa-solid fa-folder-tree"></i>
                    <span>Arquivos</span>
                </a>
                <div class="nav-divider"></div>
                <!-- NOVO BOTÃO INSTALADO -->
                <a href="javascript:void(0)" class="nav-item highlight-item" id="nav-assets" onclick="selectTab('assets')">
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                    <span>Magic Assets 3D</span>
                </a>
            </nav>

            <div class="server-status" onclick="toggleTerminal()">
                <div class="status-indicator online" id="server-indicator"></div>
                <span id="server-text">Servidor Online (3000)</span>
            </div>
        </aside>

        <!-- Main Content Area -->
        <main class="main-content">
            <header class="top-bar">
                <div class="breadcrumbs">
                    <span class="text-muted">Workspace</span> / <span class="current" id="breadcrumb-title">Início</span>
                </div>
                <div class="actions">
                    <!-- Visual Mode Toggle -->
                    <div class="visual-mode-toggle" id="visual-mode-wrapper">
                        <span class="text-sm mr-2 font-medium" id="visual-status-text">Modo Visual: OFF</span>
                        <label class="switch">
                            <input type="checkbox" id="visual-mode-check" onchange="toggleVisualMode(this)">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </header>

            <!-- VIEW: DASHBOARD (RAIZ) -->
            <div id="dashboard-view" class="view-section active">
                <div class="welcome-banner">
                    <h1>Painel de Controle</h1>
                    <p>Bem-vindo ao Cucaypy OS. Criado por Jose Divino Prado da Lapa.</p>
                </div>
                
                <div class="grid-3-col">
                    <div class="tool-card" onclick="selectTab('editor')">
                        <div class="icon-box blue"><i class="fa-solid fa-code"></i></div>
                        <h3>Editor</h3>
                    </div>
                    <div class="tool-card" onclick="deployProject()">
                        <div class="icon-box green"><i class="fa-solid fa-rocket"></i></div>
                        <h3>Deploy Live</h3>
                    </div>
                    <div class="tool-card" onclick="selectTab('assets')">
                        <div class="icon-box purple"><i class="fa-solid fa-cubes-stacked"></i></div>
                        <h3>Loja 3D</h3>
                    </div>
                </div>

                <div class="deploy-info-card">
                     <h4><i class="fa-solid fa-network-wired"></i> Status da Rede</h4>
                     <div class="info-row">
                        <span>Porta:</span> <span class="text-green">3000 (Active)</span>
                     </div>
                     <div class="info-row">
                        <span>Environment:</span> <span class="text-blue">Production</span>
                     </div>
                     <div class="info-row">
                        <span>Uptime:</span> <span id="uptime-counter">00:00:00</span>
                     </div>
                </div>
            </div>
            
            <!-- VIEW: MAGIC ASSETS 3D (NOVA FERRAMENTA FUNCIONAL) -->
            <div id="assets-view" class="view-section" style="display: none;">
                <div class="store-header">
                    <h2><i class="fa-solid fa-cloud-arrow-down"></i> Loja de Assets 3D</h2>
                    <p class="text-muted">Pesquise, baixe e copie para usar no Editor Visual.</p>
                    <div class="search-bar-lg">
                        <input type="text" id="asset-search-input" placeholder="Buscar assets (ex: banner, botão)..." onkeyup="handleAssetSearch(event)">
                        <button class="btn-primary" onclick="triggerSearch()"><i class="fa-solid fa-search"></i></button>
                    </div>
                    <div class="store-tabs">
                        <button class="store-tab active" id="tab-all" onclick="filterStore('all')">Loja Online</button>
                        <button class="store-tab" id="tab-saved" onclick="filterStore('saved')">Meus Downloads <span id="saved-count" class="badge">0</span></button>
                    </div>
                </div>

                <div class="assets-grid" id="assets-grid">
                    <!-- Preenchido via JS -->
                </div>
            </div>

            <!-- VIEW: EDITOR -->
            <div id="editor-view" class="view-section" style="display: none;">
                <div class="editor-layout">
                    <div class="editor-main full-width">
                         <div class="editor-toolbar">
                            <span><i class="fa-solid fa-eye"></i> Preview do Site (Modo Visual Disponível)</span>
                            <button class="btn-sm-icon" onclick="deployProject()" title="Abrir em nova aba"><i class="fa-solid fa-external-link"></i> Abrir Live</button>
                        </div>
                        <!-- Área de Preview Interna para Teste Visual -->
                        <div class="preview-mockup-container">
                            <div id="visual-editor-canvas" class="visual-canvas">
                                <!-- Elementos Iniciais do Site -->
                                <div class="visual-item header-section">
                                    <h1>Meu Site 3D</h1>
                                    <p>Dê dois toques aqui para testar o menu.</p>
                                </div>
                                <div class="visual-item content-box">
                                    <p>Esta área está vazia. Ative o Modo Visual, vá na loja, copie um banner e cole aqui!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- VIEW: FILES -->
            <div id="files-view" class="view-section" style="display: none;">
                <div class="card">
                    <div class="card-header"><h2>Arquivos</h2></div>
                    <div class="file-tree">
                        <div class="tree-item folder open"><i class="fa-solid fa-folder text-yellow-500"></i> root</div>
                        <div class="tree-children">
                            <div class="tree-item file"><i class="fa-brands fa-html5 text-orange-500"></i> index.html</div>
                            <div class="tree-item file"><i class="fa-brands fa-css3 text-blue-500"></i> style.css</div>
                            <div class="tree-item file"><i class="fa-brands fa-js text-yellow-500"></i> script.js</div>
                            <div class="tree-item file"><i class="fa-brands fa-npm text-red-500"></i> package.json</div>
                        </div>
                    </div>
                    <div class="card-footer" style="margin-top: 20px;">
                        <button class="btn-primary" style="width:100%" onclick="downloadProject()"><i class="fa-solid fa-download"></i> Baixar Projeto (.html)</button>
                    </div>
                </div>
            </div>

        </main>
    </div>
    <script src="script.js"></script>
</body>
</html>`
    },
    {
        name: 'style.css',
        language: 'css',
        content: `:root {
    --bg-dark: #0f172a;
    --bg-card: #1e293b;
    --primary: #6366f1;
    --border: #334155;
    --term-bg: #0c0c0c;
    --term-text: #22c55e;
}
* { box-sizing: border-box; outline: none; }
body { margin: 0; font-family: 'Inter', sans-serif; background: var(--bg-dark); color: #f8fafc; height: 100vh; overflow: hidden; }

.app-container { display: flex; height: 100%; }
.sidebar { width: 240px; background: #020617; border-right: 1px solid var(--border); padding: 1.5rem; display: flex; flex-direction: column; }
.main-content { flex: 1; overflow-y: auto; background: var(--bg