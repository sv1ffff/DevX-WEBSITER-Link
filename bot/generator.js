const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const ROOT = path.join(__dirname, '..');
const TEMP = path.join(ROOT, 'temp');

const LINK_DEFS = [
    { key: 'youtube', icon: 'assets/youtube.png', label: 'YouTube' },
    { key: 'discord', icon: 'assets/discord.png', label: 'Discord' },
    { key: 'tiktok',  icon: 'assets/tiktok.png',  label: 'TikTok' },
    { key: 'github',  icon: 'assets/github.png',  label: 'GitHub' }
];

const ASSETS_COPY = [
    'discord.png', 'github.png', 'youtube.png', 'tiktok.png',
    'Angel_wish.ttf', 'custom_cursor.png',
    'staff.gif', 'owner.gif', 'partner.gif', 'developer.png',
    'bug_bounty.gif', 'hated_guns.gif', 'hated_fakecrime.gif',
    'hated_fakecrime1.gif', 'verified.gif', 'rule_maker.gif',
    'car_background.mp4', 'car_music.mp3'
];

function esc(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateSite(data, opts = {}) {
    return new Promise((resolve, reject) => {
        const name = esc(data.name || 'User');
        const safe = name.replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '').slice(0, 30) || 'user';
        const folder = `DEVXSQ-${safe}`;
        const outDir = path.join(TEMP, folder);
        const assetOut = path.join(outDir, 'assets');

        if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true, force: true });
        fs.mkdirSync(assetOut, { recursive: true });

        let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
        html = html.replace(/{{USER_NAME}}/g, name);
        html = html.replace('{{PROFILE_PIC}}', esc(data.profilePic || 'https://cdn.discordapp.com/embed/avatars/0.png'));
        html = html.replace('{{USER_BIO}}', esc(data.bio || 'Hello World'));

        let linksHtml = '';
        for (const l of LINK_DEFS) {
            if (data[l.key]) {
                linksHtml += `<a href="${esc(data[l.key])}" target="_blank" class="social-link" title="${l.label}"><img src="${l.icon}" alt="${l.label}" class="social-icon"></a>\n            `;
            }
        }
        html = html.replace('{{LINKS_HTML}}', linksHtml);

        fs.writeFileSync(path.join(outDir, 'index.html'), html);

        let js = fs.readFileSync(path.join(ROOT, 'script.js'), 'utf-8');
        fs.writeFileSync(path.join(outDir, 'script.js'), js);

        const assetSrc = path.join(ROOT, 'assets');
        const list = opts.excludeMedia
            ? ASSETS_COPY.filter(f => !f.endsWith('.mp4') && !f.endsWith('.mp3'))
            : ASSETS_COPY;
        for (const f of list) {
            const src = path.join(assetSrc, f);
            if (fs.existsSync(src)) fs.copyFileSync(src, path.join(assetOut, f));
        }

        // Create ZIP archive
        const zipPath = path.join(TEMP, `${folder}.zip`);
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            // Retry rm up to 5 times (Windows file lock delay)
            function rmRetry(n) {
                try { fs.rmSync(outDir, { recursive: true, force: true }); resolve(zipPath); }
                catch (e) { if (n > 0) setTimeout(() => rmRetry(n - 1), 200); else { console.error('rm fail:', e.message); resolve(zipPath); } }
            }
            rmRetry(5);
        });
        archive.on('error', (err) => reject(err));
        archive.pipe(output);
        archive.directory(outDir, folder);
        archive.finalize();
    });
}

module.exports = { generateSite };
