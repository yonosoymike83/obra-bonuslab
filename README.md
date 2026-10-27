# A peu d'obra · Mystery Cache

Miniweb estàtica en català per publicar a GitHub Pages. No necessita servidor ni base de dades.

## Fitxers
- `index.html`: estructura de la pàgina.
- `style.css`: disseny responsive.
- `script.js`: etapes, respostes, càlcul del PEM i revelació final.

## Abans de publicar
Obre `script.js` i edita l'objecte `CONFIG`:

```js
houseAreaM2: 120,
pemPerM2: 1200,
finalCoordinates: 'N 00° 00.000 E 000° 00.000',
```

Aquests valors són provisionals de demostració. Substitueix la superfície, el mòdul €/m² i les coordenades pels valors definitius del Mystery. El PEM esperat es calcula automàticament com `superfície × mòdul €/m²`.

Revisa també els enunciats i les respostes correctes de les cinc etapes a `CONFIG.stages`. Les solucions constructives són exemples genèrics i s'han d'ajustar a l'enigma definitiu.

## Publicar a GitHub Pages
1. Crea un repositori nou a GitHub, per exemple `a-peu-dobra-mystery`.
2. Puja `index.html`, `style.css`, `script.js` i `README.md` a l'arrel del repositori.
3. Ves a **Settings → Pages**.
4. A **Build and deployment**, tria **Deploy from a branch**, selecciona `main` i `/ (root)` i desa.
5. Espera que GitHub Pages publiqui el lloc.

## Nota de seguretat
Com que és una web estàtica sense backend, les respostes correctes i les coordenades es poden consultar al codi JavaScript. És adequat per a un Mystery Cache informal, però no impedeix que algú inspeccioni el codi font.
