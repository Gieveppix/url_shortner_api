// router.post('/shorten', authenticate, async (req, res) => {
//   const { originalUrl, shortCode } = req.body;
//   const url = await createShortUrl(originalUrl, shortCode, req.user);
//   res.json(url);
// });

// router.get('/:shortCode', async (req, res) => {
//   const { shortCode } = req.params;
//   const url = await findUrlByShortCode(shortCode);
//   if (url) {
//     res.redirect(url.originalUrl);
//   } else {
//     res.status(404).json({ message: 'URL not found' });
//   }
// });

// router.get('/', authenticate, async (req, res) => {
//   const urls = await getUserUrls(req.user);
//   res.json(urls);
// });

// router.delete('/:id', authenticate, async (req, res) => {
//   await deleteUrl(req.params.id, req.user);
//   res.json({ message: 'URL deleted' });
// });