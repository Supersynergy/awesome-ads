# Recherche · 12.11.2026

Die Sammlung erweitert eine frühere Google-Ads-Recherche vom 10.11.2026. Alle bisherigen 100 Repo-Einträge und 100 Skill-Einträge bleiben über `legacyId` im gemeinsamen Register erreichbar. Ihre Inhalte behalten den damaligen Pin und Inhaltsprüfstand. Die GitHub-Metadaten aller 123 ausgewählten Repos wurden am 12.11.2026 erneut abgefragt. `commit` bezeichnet den Inhalts-Pin; `latestCommit` den damals aktuellen Upstream-Stand. Unterschiedliche Commits lösen keine automatische Ersetzung aus.

## Tatsächlich verwendete Recherchewege

| Werkzeug | Ausführung | Befund und Grenze |
|---|---|---|
| GHMax | Live-Repo-Suche nach `awesome advertising marketing` und `ads skills` | 13 und 50 Treffer. Jobanzeigen, NASA ADS, Werbespam und unpassende Wrapper ausgeschieden. Trefferzahl ist keine Zahl geprüfter Empfehlungen. |
| Superweb Mega | Vier Suchmaschinen, eine Seite, höchstens 35 Resultate, ohne automatische Seitenextraktion | Zusätzliche Discovery für Ads-Skills und Plattformwerkzeuge. Verlinkte Originalquellen separat geprüft. |
| Gitstars | `superweb gitstars --explore advertising --limit 20` | Vier Treffer, geringe relevante Abdeckung. Eine alte Amazon Product Advertising API ist eine Affiliate-/Produkt-Schnittstelle und keine Amazon Ads API; nicht als Werbesteuerung übernommen. |
| Metacode | `metacode live gh-search "ads skills marketing"` | Zwölf aktuelle Repo-Kandidaten. Kein Architekturplan und kein kompletter Codeaudit. |
| GitHub API | Gebündelte GraphQL-Metadaten, READMEs, rekursive Skill-Dateibäume und gepinnte Blobs | 123 eindeutige Repos. 14 Skill-Quellenrepos durchsucht; Ads-nahe Teilbereiche ausgewählt, nicht ganze Cloud-/Email-/SEO-Bestände pauschal übernommen. |
| YouTube / yt-dlp | Vier gezielte Suchanfragen, jeweils drei Ergebnisse | Zwölf aktuelle Metadatenfunde. Zusammen mit der früheren Acht-Video-Stichprobe ergeben sich nach Deduplizierung 18 Videos. Neue Funde nicht transkribiert; keine gemessene Wachstumsgeschwindigkeit. |
| Superweb Batch | 18 ursprüngliche Dokumentations-URLs | Neun direkt lesbare 200-Antworten, ein falscher Snap-Pfad und acht unzureichend extrahierte JS-/Portal-Seiten. Snap- und Telegram-Quellen korrigiert; ergänzend Originalquellen über Websuche/Browser-Extraktion und Anbieter-SDKs geprüft. Fehlende Lesbarkeit nicht als fehlende API interpretiert. |

[Recherchemanifest](evidence/research-manifest.json), [Repo-Snapshots](evidence/repository-snapshots.json) und [zusätzlicher Skill-Index](evidence/skill-index.json) dokumentieren die Quellenbindung. Private Arbeitsprotokolle sind nicht Teil dieses Repos.

## Weitere Awesome-Listen

Neun sind im [Awesome-Repo-Verzeichnis](AWESOME-REPOS.md) enthalten. Besonders relevant sind [Awesome AI Ads](https://github.com/hermoso-ai/awesome-ai-ads) für Anzeigenbibliotheken und Agent-Schnittstellen, [Awesome Ads](https://github.com/TMHSDigital/Awesome-Ads) für Kanal-Playbooks, [Awesome Marketing Science](https://github.com/shakostats/Awesome-Marketing-Science) für Messmethoden und [Awesome Advertising](https://github.com/cenoura/awesome-ads) für AdTech-Begriffe. Kleine Sammlungen bleiben als Discovery-Referenzen gekennzeichnet.

Behauptungen der Listen werden nicht ungeprüft übernommen. Insbesondere lässt sich aus einer langen Anzeigenlaufzeit keine Profitabilität ableiten. Eine Community-Listung beweist weder Security noch aktuellen Produktsupport.

## Aktuelle Originalquellen

- [TikTok Agentic Hub / MCP](https://ads.tiktok.com/business/en/blog/tiktok-agentic-hub-ai-agents-skills-mcp): offizieller Einstieg für Agent-Workflows. Funktionsumfang und Zugang müssen vor Nutzung im konkreten Konto geprüft werden.
- [Amazon Ads MCP](https://advertising.amazon.com/library/news/amazon-ads-mcp-server-open-beta): offizieller MCP-Einstieg; kein hier installierter oder getesteter Kontozugang.
- [Snap Marketing API](https://developers.snap.com/marketing-api/home): aktueller Dokumentationseinstieg einschließlich Ads MCP, Gallery und Conversions API. Der zunächst verwendete `/api/marketing-api/Introduction`-Pfad lieferte 404 und wurde ersetzt.
- [Apple Ads Platform API](https://developer.apple.com/documentation/apple-ads-platform-api/calling-apple-ads-platform-api): aktuelle Platform-API-Dokumentation von älteren Search-Ads-Beispielen getrennt behandeln.
- [Telegram Ad Platform](https://ads.telegram.org/getting-started): Anzeigenplattform statt der zunächst gefundenen allgemeinen Bot-API-Dokumentation.

Es wurden keine zusätzlichen Pakete installiert, keine bezahlten Provider aufgerufen und keine Werbekonten verbunden oder verändert. Erfasst ist dokumentarische Funktionsabdeckung. Der gesamte ausführbare Code der Fremdprojekte wurde nicht auditiert; Empfehlungen müssen am konkreten Engpass und eigenen Geschäftsergebnis geprüft werden.
