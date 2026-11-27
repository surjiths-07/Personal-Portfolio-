const app = require('../backend/src/server');
const { ensureDatabaseReady } = require('../backend/src/utils/initDb');

let initPromise = null;

module.exports = async (req, res) => {
  if (String(process.env.AUTO_INIT_DB || '').toLowerCase() === 'true') {
    if (!initPromise) {
      initPromise = ensureDatabaseReady().catch((err) => {
        initPromise = null;
        console.error('[Vercel Auto DB Init Warning]', err.message);
      });
    }
    await initPromise;
  }

  return app(req, res);
};
