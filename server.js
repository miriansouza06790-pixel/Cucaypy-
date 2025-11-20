

// 1. CHAVE SECRETA: Lê a chave GEMINI_API_KEY do seu arquivo .env
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai'); // Importa o SDK da Gemini

// Inicializa o cliente da Gemini usando a chave do .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

const app = express();
const port = 3000;
const DATA_FILE = path.join(__dirname, 'project_data.json');

// --- Configurações Iniciais ---
app.use(cors()); 
app.use(express.json()); 
app.use(express.static(__dirname));

// --- 🎯 ROTAS DA API GrapesJS/Cucaypy ---

// 1. ROTA DE CARREGAMENTO (GET)
// Endpoint: http://localhost:3000/api/cucaypy/load
app.get('/api/cucaypy/load', (req, res) => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            console.log('Dados carregados com sucesso.');
            return res.json(JSON.parse(data));
        } else {
            console.log('Nenhum arquivo de projeto encontrado. Iniciando projeto vazio.');
            return res.json({});
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        return res.status(500).send({ error: 'Falha ao carregar dados do projeto.' });
    }
});

// 2. ROTA DE SALVAMENTO (POST)
// Endpoint: http://localhost:3000/api/cucaypy/save
app.post('/api/cucaypy/save', (req, res) => {
    try {
        const dataToSave = req.body;
        fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2));
        console.log('Dados salvos com sucesso.');
        return res.status(200).send({ message: 'Projeto salvo com sucesso.' });
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        return res.status(500).send({ error: 'Falha ao salvar dados do projeto.' });
    }
});

// 3. ROTA DE GERAÇÃO DE CONTEÚDO IA (POST) - AGORA É REAL!
// Endpoint: http://localhost:3000/api/cucaypy/generate-ai
app.post('/api/cucaypy/generate-ai', async (req, res) => {
    console.log('Requisição de Geração de IA real recebida.');
    
    // O prompt é enviado do seu editor frontend via corpo da requisição
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).send({ error: 'Prompt de IA é obrigatório.' });
    }

    try {
        // --- CHAMADA REAL À API GEMINI ---
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Modelo de IA rápido
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        const aiContent = {
            // Retorna o texto puro gerado pela IA
            content: response.text
        };

        console.log('Conteúdo de IA gerado e enviado.');
        return res.json(aiContent);

    } catch (error) {
        // Captura erros de comunicação, chave inválida, etc.
        console.error('ERRO FATAL NA API GEMINI:', error.message);
        return res.status(500).send({ 
            error: 'Falha ao gerar conteúdo de IA. Verifique sua chave de API e logs do servidor.' 
        });
    }
});

// --- Inicia o Servidor ---
app.listen(port, () => {
    console.log(`\n🎉 Servidor Cucaypy rodando em: http://localhost:${port}/`);
});
