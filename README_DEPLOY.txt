Deploy RighTool.ai to Vercel
================================
1. Unzip this folder, then open a terminal inside it.
2. If needed: npm install -g vercel
3. vercel login
4. vercel --prod

That publishes the site. After it is live, point the rightool.ai domain at it:
  vercel domains add rightool.ai
then set the DNS records Vercel shows you at your domain registrar.

What is in this folder
- index.html: the full site (exact export of the RighTool.ai build).
- robots.txt, llms.txt, sitemap.xml: crawler and AI-agent files, generated from the site's own directory data.
- vercel.json: clean-URL fallback (every route serves the app) plus logo rewrites.
- Tool logos: served through vercel.json rewrites to each brand's official logo (Clearbit). If a brand logo ever fails to load, the site falls back to its initials tile, exactly as the preview does.
