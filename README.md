# lenke til repo
https://github.com/SebastianMusic/ikt205g26v-4

# bygginginstruksjoner
## Felles instruksjoner
Klon prosjektet
```bash
git clone https://github.com/SebastianMusic/ikt205g26v-4
cd ikt205g26v-4

```

Installer pakker
```bash
npm install
```


### lokal dev
Pass på at du har en android telefon tilkoblet datamaskinen.
Start development build.
```bash
npx expo run:android 

```
### lokal built apk
Forsikre deg at du har eas-cli globalt installert
```
npm install -g eas-cli
```

Bygg applikasjonen
```bash
eas  build --platform android --profile preview --local
```


# oppnådde krav
## 1. The Testing Suite (35%)

### Bruk Jest eller annet et egnet test-bibliotek for å verifisere kjernefunksjonaliteten.

- [x] (10%) Unit Test - Opprettelse & Navigasjon: Lag en test som bekrefter at når et gyldig notat sendes inn, blir det "opprettet" (logikken kjører) og brukeren blir automatisk navigert tilbake til hovedskjermen.
- [x] (15%) Integration Test - Mocking & Loader: Lag en test som simulerer henting av et notat fra databasen. Testen skal verifisere at en "laste-indikator" (spinner/loader) er synlig mens kallet pågår, og at den forsvinner når det enkelte notatet er lastet inn.
- [x] (10%) Auth Guard Test - Tilgangskontroll: Test at appens beskyttede innhold (f.eks. "Legg til notat"-skjermen eller selve notatlisten) ikke er tilgjengelig eller synlig dersom brukeren ikke er logget inn.
 
## 2. Production Readiness & Optimization (40%)

### Gjør appen robust og effektiv for sluttbrukeren.

- [x] (10%) Log Cleanup: Det skal være null console.log-setninger i den endelige innleveringen. Koden skal fremstå profesjonell og "ren".
- [x] (10%) Resource Management - Kamera: Sørg for at kamerakomponenten ikke kjører i bakgrunnen. Den må enten avmonteres helt (unmount) eller settes i en "pause"-tilstand når brukeren navigerer bort fra skjermen.

### Pagination (Skalering):
- [x] (10%) Endre logikken for henting av notater slik at appen kun henter de 5 første notatene fra databasen.
- [x] (10%) Implementer en "Last mer"-knapp (eller automatisk "infinite scroll") som henter de neste 5 notatene.

## 3. Build & Dokumentasjon (25%)

### Dokumentasjon av selve leveranseprosessen.

- [x] (10%) App Fil: En kjørbar build-fil (f.eks. en .apk for Android) må legges ved. Denne teller alene 10% og må fungere i en emulator eller på en fysisk enhet.
- [x] (15%) Build-dokumentasjon (README):
Byggeinstruks: En kort beskrivelse av hvordan man bygger appen fra kildekoden

