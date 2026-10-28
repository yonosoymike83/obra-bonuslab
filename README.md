# A peu d'obra · Mystery Cache

Web estàtica responsive per GitHub Pages, sense servidor ni base de dades.

## Fitxers
- `index.html`: estructura de les pantalles.
- `style.css`: disseny fosc adaptable a mòbil i ordinador.
- `script.js`: partides, selecció de sistemes, validació final i coordenades.

## Publicar a GitHub Pages
1. Puja aquests fitxers directament a l'arrel del repositori.
2. Ves a **Settings → Pages**.
3. A **Build and deployment**, tria **Deploy from a branch**, `main` i `/(root)`.
4. Desa i espera que GitHub publiqui el lloc.

## Configuració abans de publicar
Obre `script.js` i modifica `CONFIG`:
- `houseAreaM2`: superfície construïda de l'enigma.
- `pemPerM2`: mòdul de PEM definitiu.
- `finalCoordinates`: coordenades finals reals.
- `pemToleranceEuros`: marge permès per al càlcul.
- `stages`: revisa els enunciats, opcions i índex `correct` segons l'enigma definitiu.

Les dades actuals (120 m², 1.200 €/m² i coordenades fictícies) són provisionals. Cal substituir-les abans de publicar.

## Mecànica
- La pantalla inicial mostra totes les partides del pressupost.
- Cada partida obre una pantalla pròpia amb opcions i una explicació breu.
- El tick indica que hi ha una selecció, no que sigui correcta.
- En prémer **Enviar al client**, es revisen totes les respostes i el PEM.
- Només si tot és correcte apareixen les coordenades.

## Nota de seguretat
GitHub Pages publica fitxers estàtics. Per tant, les respostes correctes i les coordenades es poden inspeccionar al codi font. Aquesta validació és adequada per a un joc recreatiu, però no protegeix les solucions davant usuaris que examinin el JavaScript.
