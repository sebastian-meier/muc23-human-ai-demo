const fs = require("fs");
const http = require("http");
require('dotenv').config();

const OpenAI = require("openai");

const ai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

const p = "./compare-ui/public/data/";

let keywords = fs.readFileSync(p + "use-metadata.tsv", 'utf8').split('\n').map(t => t.trim()).filter(t => t.length > 0);

const files = [
    "use-cosine-tsne-cluster-5",
    "use-cosine-tsne-cluster-20",
    "use-cosine-tsne-cluster-50",
    "use-euclidean-tsne-cluster-5",
    "use-euclidean-tsne-cluster-20",
    "use-euclidean-tsne-cluster-50"
]

const terms = JSON.parse(fs.readFileSync('./output.json', 'utf8'));
files.forEach(f => { 
    if (!(f in terms)) {
        terms[f] = {};
    }
});

const llamaGet = async (keywords) => {
    return new Promise((resolve, reject) => {
        const req = http.request({
            host: "localhost",
            port: "11434",
            path: "/api/generate",
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        }, (r) => {
            let data = '';
            r.on('data', (chunk) => {
                data += chunk;
            });
            r.on('end', () => {
                const term = data.split("\n").filter(l => l.length > 0).map(l => JSON.parse(l)).filter(l => !l.done).map(l => l.response).join("");
                resolve(term);
            });
            r.on('error', (e) => {
                reject(e);
            })
        });

        req.write(JSON.stringify({
            model: 'llama2',
            prompt: 'what term best summarizes the following list of terms, only provide the new term as an answer: ' + keywords.join(', ')
        }));

        req.end();
    });
};

const chatgptGet = async (keywords) => {
    const response = await ai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{"role": "user", "content": 'what term best summarizes the following list of terms, only provide the new term as an answer: ' + keywords.join(', ')}],
        temperature: 0.7
    });
    return response.choices[0].message.content;
}

(async () => {
    for (let fi = 0; fi < files.length; fi++){
        const f = files[fi];
        const clusters = fs.readFileSync(p + f + ".tsv", "utf8").split('\n').map(t => t.trim()).filter(t => t.length > 0);
        let clusterGroups = {};
        clusters.forEach((c,ci) => {
            if (!(c in clusterGroups)) {
                clusterGroups[c] = [];
            }
            clusterGroups[c].push(keywords[ci]);
        });
        const keys = Object.keys(clusterGroups);
        for (let ki = 0; ki < keys.length; ki++){
            const k = keys[ki];
            if (!(k in terms[f])) {
                try {
                    const term = await chatgptGet(clusterGroups[k]);
                    terms[f][k] = term.trim();
                    fs.writeFileSync("./output.json", JSON.stringify(terms), 'utf8');
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }
})();