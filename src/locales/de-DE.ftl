app-title = Inventar

startpage = Startseite
statistics = Statistiken
about = Über
contact = Kontakt
objects = Objekte
permissions = Berechtigungen
roles = Rollen
users = Benutzer*innen
verify-object-history = Objektverlauf bestätigen

verify-object-history-successful = Du hast deine Eingabe erfolgreich bestätigt.
verify-object-history-failed = Die Bestätigung deiner Eingabe ist fehlgeschlagen.

error-with-message = Fehler: { $message }
try-again = Bitte versuche es erneut.
error-page-title = Etwas ist schiefgelaufen!

about-content =
  <p>Dies wird die Über-Seite sein.</p>
  <p>Ein weiterer Absatz.</p>
  <h2>Überschrift</h2>
  <p>Ein weiterer Absatz.</p>

id = ID
email = E-Mail
last-updated-at = Zuletzt aktualisiert am
roles = Rollen
actions = Aktionen
name = Name

change-language = Sprache ändern

update-location = Standort aktualisieren
location-updated = Standort aktualisiert
location-updated-description = Der Standort des Objekts wurde erfolgreich aktualisiert.

code-required = Objektcode ist erforderlich.
address-required = Bitte gib eine Adresse ein.
latitude-required = Breitengrad ist erforderlich.
latitude-must-be-number = Der Breitengrad muss eine Zahl sein.
latitude-must-be-between = Der Breitengrad muss zwischen -90 und 90 liegen.
latitude-can-not-zero = Der Breitengrad darf nicht null sein.
longitude-required = Längengrad ist erforderlich.
longitude-must-be-number = Der Längengrad muss eine Zahl sein.
longitude-must-be-between = Der Längengrad muss zwischen -180 und 180 liegen.
longitude-can-not-zero = Der Längengrad darf nicht null sein.

email-invalid = Ungültige E-Mail-Adresse.
error-update-location = Standortaktualisierung fehlgeschlagen.
error-fetching-location = Abrufen des Standorts fehlgeschlagen.

object-code = Objektcode
object-code-description = Der Objektcode befindet sich direkt auf dem Objekt.

address = Adresse
fill-in-from-coordinates = Aus Koordinaten ausfüllen
address-placeholder = Hausnummer, Straße, Stadt, Land
search-address = Adresse suchen
address-description = Die Adresse, an der sich das Objekt aktuell befindet. Gib so viele oder wenige Details an, wie du möchtest. Diese Angabe ist nur informativ. Die Geokoordinaten werden verwendet, wenn der Standort benötigt wird.

coordinates = Koordinaten
coordinates-description = Klicke auf die Karte, um den Standort einzutragen.
latitude = Breitengrad
longitude = Längengrad

your-email = Deine E-Mail
your-email-placeholder = name@email.org
your-email-description = Diese E-Mail wird verwendet, um deinen Eintrag zu moderieren. Sie wird nicht öffentlich angezeigt.

okay = Okay
cancel = Abbrechen
save-location = Standort speichern

no-location-entries = Noch keine Standorteinträge.
current-location = Aktueller Standort
past-locations = Frühere Standorte

rename-object = Name ändern
update-location = Standort aktualisieren
list = Liste
map = Karte

programming-hours-title = Programmierstunden
programming-hours-description = Die für das Programmieren aufgewendeten Stunden.<br />Dies ist eine Schätzung basierend auf den Commits im Repository.
granularity = Granularität
day = Tag
week = Woche
month = Monat
year = Jahr

date-range-picker-placeholder = Wähle einen Datumsbereich
today = Heute
yesterday = Gestern
last-week = Letzte Woche
last-month = Letzter Monat
last-year = Letztes Jahr

add-object-button = Objekt erstellen
error-unkown-error = Ein unbekannter Fehler ist aufgetreten.
error-failed-to-create-object = Objekt konnte nicht erstellt werden.

no-results = Keine Ergebnisse

light-theme = Hell
dark-theme = Dunkel
system-theme = System

error-name-min-length = Der Name muss mindestens 3 Zeichen lang sein.
error-name-max-length = Der Name darf nicht länger als 100 Zeichen sein.
success-name-is-same = Der Name ist bereits so eingestellt.
success-name-updated = Objekt umbenannt
error-failed-to-rename-object = Objekt konnte nicht umbenannt werden.
change-name-button = Name ändern
change-name-title = Objekt umbenennen
change-name-description = Den Namen des Objekts ändern.
name-label = Name
name-placeholder = Der neue Name…
name-description = Der Name wird öffentlich angezeigt.
save-name = Namen speichern

update-location-button = Standort aktualisieren
update-location-title = Standort aktualisieren
update-location-description = Aktualisiere, wo sich das Objekt aktuell befindet.

success-updated-location = Standort erfolgreich aktualisiert

success-roles-updated = Rollenänderung erfolgreich.
error-roles-update-failes = Rollenänderung fehlgeschlagen.
remove-admin-rights = Adminrechte entziehen
give-admin-rights = Adminrechte vergeben

sign-in = Anmelden
sign-out = Abmelden

menu = Menü
admin-menu = Admin-Menü

verify-badges-all-done-title = Alles bestätigt!
verify-badges-all-done-description = Dieser Eintrag ist vertrauenswürdig.
okay-great = Super, alles klar :)
verify-badges-trusted-title = Vertrauenswürdig
verify-badges-trusted-badge = Bekannte Person
verify-badges-trusted-description =
  <strong>
    Diese Einreichung stammt von einer als vertrauenswürdig markierten Person.
  </strong>
  <span>Wenn erforderlich, kann ein Administrator eine Person als nicht vertrauenswürdig markieren.</span>
  <span>
    Die Standorteinreichung ist mit dieser E-Mail-Adresse signiert: <email>{$email}</email>
  </span>

verify-badges-not-trusted-title = Vertrauenswürdige Person?
verify-badges-not-trusted-badge = Unbekannte Person
verify-badges-not-trusted-description =
  <strong>
    Diese Einreichung stammt von einer Person, die noch nicht als vertrauenswürdig markiert ist.
  </strong>
  <span>
    Wenn du diese Person anhand ihrer E-Mail-Adresse erkennst, kannst du sie als vertrauenswürdig markieren. Diese Entscheidung stellt sicher, dass ihre zukünftigen Einträge automatisch überprüft werden. Wenn erforderlich, kann ein Administrator diese Aktion rückgängig machen.
  </span>
  <span>
    Die Standorteinreichung ist mit dieser E-Mail-Adresse signiert: <email>{$email}</email>
  </span>

trust-person-cancel-button = Nein, abbrechen
trust-person-submit-button = Ja, ich vertraue dieser Person

email-verified-title = E-Mail bestätigt
email-verified-badge = E-Mail bestätigt
email-verfied-description =
  <span>
    Die E-Mail-Adresse <email>{email}</email> wurde für diese Standorteinreichung verifiziert und bestätigt.
  </span>
  <span>
    Die Verifizierung wurde entweder durch Klicken auf einen Link in einer Bestätigungs-E-Mail oder durch Anmeldung mit dem eigenen Konto abgeschlossen.
  </span>
email-not-verified-title = E-Mail nicht bestätigt
email-not-verified-badge = E-Mail nicht bestätigt
email-not-verfied-description =
  <span>
    Die E-Mail-Adresse <email>{email}</email> wurde <strong>nicht</strong> verifiziert.
  </span>
  <span>
    Das bedeutet, dass die Person ihre Einreichung nicht bestätigt hat, indem sie auf den Verifizierungslink in ihrer E-Mail geklickt oder sich mit ihrem Konto angemeldet hat.
    <br />
  </span>
  <span>
    Ohne Verifizierung kann dieser Eintrag nicht vollständig vertrauenswürdig sein.
  </span>

change-theme = Design ändern
