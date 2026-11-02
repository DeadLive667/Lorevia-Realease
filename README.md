# Lorevia Community

Ein lokales Windows-Programm für interaktive Geschichten. Du steuerst deine Figur, die lokale KI übernimmt die anderen Figuren. Eigene Texte werden als Handlung in Du-Form mit eingebetteter direkter Rede dargestellt.

## Herunterladen und starten

1. Unter [Releases](https://github.com/DeadLive667/Lorevia-Realease/releases) das **Lorevia-Community-Setup** herunterladen und installieren.
2. Beim ersten Start den persönlichen Nutzungsschlüssel vollständig einfügen. Du bekommst ihn vom Herausgeber. Eine Anmeldung ist nicht nötig.
3. Unter **KI einrichten** Ollama und ein Modell einrichten. Dafür werden einmalig Internet und mehrere GB freier Speicher benötigt. Die Modelle sind nicht im Installer enthalten.
4. Eine Geschichte beginnen, Figuren wählen oder erstellen und loslegen.

Die Freischaltung und deine Daten bleiben auf deinem PC. Community und die bisherige private Lorevia-Installation verwenden getrennte Datenverzeichnisse. Die Deinstallation löscht deine Geschichten nicht automatisch.

## Erzählen und Fortsetzen ab 0.5.1

Ab **0.5.2** öffnet **Geschichte & Erzählweise** einen Dialog mit getrennten Reitern für Handlung, Figurenwissen, offene Fragen und Termine. Die Erzählweise **Kurz**, **Ausgewogen** oder **Ausführlich** gilt pro Geschichte und bleibt beim Export erhalten. Du musst nicht alle Felder ausfüllen. „Abbrechen“ und Schließen übernehmen keine Änderungen.

Bei größeren Modellen werden fehlerhafte Absätze vollständig neu angefordert, statt einzelne Sätze aus einem Entwurf zu schneiden. Einige eindeutige Format-, Grammatik- und Terminfehler werden zusätzlich erkannt. Das ist keine vollständige inhaltliche Prüfung. Falls die Fortsetzung verworfen wird, kannst du sie mit **Fortsetzung erneut versuchen** erneut anfordern; deine eigene Eingabe wird nicht doppelt gespeichert. Nach zwischenzeitlichen Änderungen wird eine alte Anfrage nicht wiederholt.

- Handlung und NPC-Rede können gemeinsam in einem lesbaren Absatz stehen. Die Spielerfigur bleibt in Du-Form; gesprochene Worte werden fett und Flüstern kursiv dargestellt.
- Unter **Fortsetzungsstand** stehen bestätigte Tatsachen, Aussagen, Wissensgrenzen, offene Fragen, Termine und Importlücken getrennt. Diese Angaben lassen sich bearbeiten und bleiben beim Export erhalten. Ein vorgemerkter Test ist kein vorweggenommenes Ergebnis.
- Eine aktuelle Kampfhandlung mit der Regie **(Beschreibe es episch)** erlaubt zusätzliche körperliche Kampfhandlungen innerhalb dieser einen Szene. Eigene Worte, Gedanken, Gefühle, neue Ziele und Entscheidungen der Spielerfigur bleiben geschützt. Im nächsten Zug oder beim automatischen Welt-Takt gilt diese Freigabe nicht weiter.
- Das Szenendatum wird aus dem Spielstand beziehungsweise einer ausdrücklichen Zeitangabe übernommen. Der nächste Tag wird nicht aus der realen Uhrzeit des PCs abgeleitet.
- Die optionale zusätzliche Qualitätsprüfung ab 9B lässt einen Entwurf vor dem Übernehmen nochmals auf konkrete Widersprüche prüfen. Sie benötigt weitere Modellaufrufe und kann selbst Fehler machen; sie ist standardmäßig ausgeschaltet. Die normalen Prüfungen bleiben unabhängig davon aktiv.

Die Zielvorlage sind kurze, natürliche Dialoge, eigenständige Figuren, nachvollziehbare Beziehungen und Konsequenzen. Die Umsetzung von Regeln garantiert keine gleichbleibende literarische Qualität jedes lokalen Modells.

## Charaktere erstellen

- **Einfach:** Eine Beschreibung, ein paar Angaben oder eine der sechs Einstiegsvorlagen reichen. Die KI schlägt Ergänzungen vor. Vor dem Übernehmen kannst du jeden Vorschlag ändern oder abwählen.
- **Erweitert und Experte:** Optionale Bereiche für Identität, Aussehen, Persönlichkeit, Wünsche, Gefühle, Vergangenheit, Beziehungen, Sprache, Fähigkeiten, Eigenheiten, Werte, Entwicklung und Eigeninitiative.
- **Feste Angaben behalten:** Vorhandene Werte werden bei der neuen KI-Ergänzung nicht überschrieben. Einzelne Felder lassen sich zusätzlich sperren, auch wenn sie leer bleiben sollen.
- **Lokal speichern:** „Figur hinzufügen“ speichert die Figur in der Geschichte. „Als Vorlage speichern“ macht sie auf deinem PC in weiteren Geschichten wiederverwendbar. Es gibt keine gemeinsame Online-Datenbank.
- **Vorlagen:** 114 mitgelieferte Steckbriefe und 111 zugehörige Porträts aus der freigegebenen Charakterbibliothek. Keine privaten Spielstände oder persönlichen Programmeinstellungen.
- **Import und Export:** Charakterakten können als JSON übertragen werden. Bilder und Verknüpfungen zu konkreten Figuren einer Geschichte werden dabei nicht übertragen.
- **Figur vertiefen und Dialogtest:** Die lokale KI kann Rückfragen, Hinweise zu Widersprüchen und eine kurze Testantwort vorschlagen. Der Dialogtest verändert die Geschichte nicht.

Persönliche Beziehungseinschätzungen gelten nur aus der jeweiligen Sicht. Verwandtschaft und feste Partnerschaft werden über verknüpfte Rollen abgebildet. Ziele, Wissen, Gefühle und Entwicklung werden der Erzähl-KI mitgegeben. Emotionen und Entwicklung sind beschreibbare Angaben; diese Version bietet keine vollständige automatische Simulation mit verlässlich berechneten Gefühlswerten.

## Bildprompts

Der Bildprompt-Bereich erzeugt Text für eine externe Bild-KI, keine Bilder und keine Bildvorschau. Wähle Stil, Ansicht, Haltung, Kleidung, Ausdruck, Hintergrund, Licht, Format und Sprache. Feste äußere Merkmale lassen sich für weitere Prompts festhalten. Deutsche Prompts können ohne KI-Aufruf zusammengesetzt werden; Englisch und Optimierung benötigen die lokale KI. Prompt und optionalen Negativ-Prompt kopieren, extern ein Bild erzeugen und anschließend über die Anhänge der Figur zuordnen.

Ob eine externe Bild-KI die Merkmale genau einhält, hängt von ihr ab. Für wiedererkennbare Figuren hilft ein Referenzbild in der externen Bild-KI.

## KI und Hardware

Die App verwendet Ollama, standardmäßig über `http://127.0.0.1:11434`. Für kleinere PCs ist **Qwen 3.5 2B / Sparmodus** voreingestellt. **4B** und **9B** stehen zur Auswahl; das größere Modell erzählt in den bisherigen Tests besser, benötigt aber mehr Rechenleistung und Speicher. Die Modellwahl ändert keine private Lorevia-Installation.

Zusätzlich ist **Qwen 3.5 35B-A3B** als große lokale Alternative auswählbar. Laut [offizieller Modellseite](https://ollama.com/library/qwen3.5:35b-a3b) umfasst der Download rund 22 GB. Das Modell wird getrennt geladen, braucht deutlich mehr Arbeitsspeicher und wird auf schwächeren PCs nicht automatisch ausgewählt. Ein Download allein stellt das aktive Modell nicht um.

32 GB RAM reichen für die vorgesehenen kleinen quantisierten Modelle aus. Auf PCs mit integrierter Grafik ist mit längeren Wartezeiten zu rechnen. Auf dem konkreten Ryzen-5-3400G-PC wurde noch kein Geschwindigkeitstest durchgeführt. Zusätzliche KI-Speicheranalyse ist im Community-Standard ausgeschaltet, um weitere Modellaufrufe zu reduzieren.

Eine KI kann trotz Prüfungen Fakten verwechseln, sprachliche Fehler machen oder Anweisungen unvollständig umsetzen. Charakterergänzungen deshalb vor dem Übernehmen prüfen. Regie steht in runden Klammern; sie ist keine gesprochene Rede und kein Gedanke der Spielerfigur. Ein späterer Einstieg der Spielerfigur ist auswählbar.

## Nutzungsschlüssel

Die unveränderte App sperrt Oberfläche und IPC-Funktionen bis zur Freischaltung. Schlüssel werden offline anhand einer digitalen Signatur geprüft. Im Repository befindet sich nur der öffentliche Prüfschlüssel. Der private Schlüssel und die ausgegebenen Nutzungsschlüssel gehören nicht ins Repository.

Dies ist eine einfache Offline-Freischaltung, kein manipulationssicherer Kopierschutz. Schlüssel sind nicht an Hardware gebunden und können offline nicht nachträglich zurückgerufen werden. Bei Verlust lokaler App-Daten kann derselbe gültige Schlüssel erneut eingegeben werden.

## Daten und Downloads

Standardverzeichnis: `%APPDATA%\Lorevia Community`. Darunter liegen Einstellungen, Geschichten, eigene Charaktervorlagen und die lokale Freischaltung. Es gibt keine Konten, Telemetrie oder automatische Übertragung deiner Geschichten an den Herausgeber. Beim Einrichten werden Ollama und das gewählte Modell von deren Anbietern heruntergeladen. Mit einem ausdrücklich eingestellten externen Ollama-Host verlassen KI-Anfragen den PC.

Mit einem gültigen Nutzungsschlüssel lädt der Update-Knopf immer das neueste stabile Setup aus den GitHub-Releases herunter, auch wenn dieselbe Version bereits installiert ist. Eine SHA256-Prüfsumme wird vor dem Speichern überprüft. Das Setup liegt danach unter `Downloads\Lorevia Community Updates` und kann von dir gestartet werden. Ein Download allein installiert nichts. Das Programm verwendet keine Updates aus einem privaten Desktop- oder OneDrive-Installerordner.

## Entwicklung

Dieses Repository enthält den auslieferbaren JavaScript-Stand unter `app/out`, Charaktervorlagen und die Paketkonfiguration. Der Stand wurde aus der vorhandenen Desktop-Version weiterentwickelt; es ist kein vollständiger ursprünglicher TypeScript-Quellbaum.

Mit einer passenden aktuellen Node.js-Version:

```powershell
npm ci
npm --prefix app ci
npm test
npm run dist:win
```

Das Ergebnis liegt unter `dist`. Der Windows-Installer installiert für den aktuellen Benutzer. Er ist nicht mit einem kommerziellen Codesignatur-Zertifikat signiert. Hinweise zu enthaltenen Fremdkomponenten stehen in `THIRD_PARTY_LICENSES.md`; ihre Lizenztexte bleiben im Paket enthalten.
