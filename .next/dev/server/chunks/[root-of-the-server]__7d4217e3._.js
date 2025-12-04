module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/chat-stl/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
async function POST(request) {
    try {
        const { messages, stlFileInfo } = await request.json();
        const apiKey = process.env.PERPLEXITY_API_KEY;
        if (!apiKey) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Clé API non configurée'
            }, {
                status: 500
            });
        }
        console.log('\n📥 === DONNÉES REÇUES ===');
        console.log('Messages:', messages.length);
        console.log('STL Info:', stlFileInfo);
        if (!Array.isArray(messages) || messages.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Messages invalides'
            }, {
                status: 400
            });
        }
        if (messages[messages.length - 1].role !== 'user') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Le dernier message doit être de l\'utilisateur'
            }, {
                status: 400
            });
        }
        // ✅ ENHANCE USER MESSAGE WITH FILE INFO
        let enhancedMessages = [
            ...messages
        ];
        const lastMessageIndex = enhancedMessages.length - 1;
        const lastUserMessage = enhancedMessages[lastMessageIndex].content;
        if (stlFileInfo && stlFileInfo.name) {
            const sizeKB = (stlFileInfo.size / 1024).toFixed(2);
            const sizeBytes = stlFileInfo.size;
            const fileName = stlFileInfo.name;
            const dimensionsText = stlFileInfo.dimensions ? `Largeur: ${stlFileInfo.dimensions.width.toFixed(2)} mm, Hauteur: ${stlFileInfo.dimensions.height.toFixed(2)} mm, Profondeur: ${stlFileInfo.dimensions.depth.toFixed(2)} mm` : 'Non disponibles';
            const trianglesText = stlFileInfo.triangles ? `${stlFileInfo.triangles}` : 'Non calculé';
            // ✅ ADD FILE INFO DIRECTLY TO USER MESSAGE
            const fileContext = `\n\n[CONTEXTE DU FICHIER UPLOADÉ]
Fichier: ${fileName}
Taille: ${sizeKB} KB (${sizeBytes} octets)
Dimensions: ${dimensionsText}
Triangles: ${trianglesText}`;
            enhancedMessages[lastMessageIndex] = {
                role: 'user',
                content: lastUserMessage + fileContext
            };
            console.log('📝 Message amélioré avec contexte fichier:');
            console.log(enhancedMessages[lastMessageIndex].content);
        }
        // ✅ BUILD SYSTEM PROMPT
        const systemPrompt = `Tu es un expert en modélisation 3D et fichiers STL. 
Tu as accès aux informations du fichier uploadé dans les messages de l'utilisateur.
Réponds en français, de manière concise et précise.
Utilise les données du fichier fournies pour répondre aux questions.`;
        // ✅ Build final messages
        const finalMessages = [
            {
                role: 'system',
                content: systemPrompt
            },
            ...enhancedMessages
        ];
        console.log('📤 Envoi à Perplexity:');
        console.log('   - Modèle: sonar-pro');
        console.log('   - Messages totaux:', finalMessages.length);
        console.log('   - Dernier message utilisateur:', enhancedMessages[lastMessageIndex].content.substring(0, 200));
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'sonar-pro',
                messages: finalMessages,
                max_tokens: 1024,
                temperature: 0.7
            })
        });
        const data = await response.json();
        console.log('📥 Réponse Perplexity:', response.status);
        if (!response.ok) {
            console.error('❌ Erreur API:', data.error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: data.error?.message || 'Erreur API Perplexity'
            }, {
                status: response.status
            });
        }
        const reply = data.choices[0].message.content;
        console.log('✅ Réponse:', reply.substring(0, 150) + '...\n');
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            reply: reply
        });
    } catch (error) {
        console.error('❌ Erreur serveur:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Erreur serveur interne: ' + (error instanceof Error ? error.message : 'Inconnu')
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7d4217e3._.js.map