<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap - The Layman's Vacation</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            color: #333;
            max-width: 75em;
            margin: 0 auto;
            padding: 2em;
          }
          h1 {
            color: #d4af37; /* Gold accent */
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
          }
          p {
            font-size: 14px;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 14px;
          }
          th {
            text-align: left;
            padding: 10px;
            border-bottom: 2px solid #d4af37;
            background-color: #f9f9f9;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #eee;
          }
          tr:hover td {
            background-color: #fffbf0;
          }
          a {
            color: #007bff;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <p>This is the XML Sitemap for <a href="https://laymansvacation.com">The Layman's Vacation</a>. It allows search engines to crawl the site content more efficiently.</p>
        
        <table>
          <thead>
            <tr>
              <th width="60%">URL</th>
              <th width="15%">Priority</th>
              <th width="15%">Change Frequency</th>
              <th width="10%">Last Modified</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td>
                  <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                </td>
                <td>
                  <xsl:value-of select="sitemap:priority"/>
                </td>
                <td>
                  <xsl:value-of select="sitemap:changefreq"/>
                </td>
                <td>
                  <xsl:value-of select="sitemap:lastmod"/>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
