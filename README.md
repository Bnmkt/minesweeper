## Minesweeper
*Minesweeper js*
démo disponnible ici : [bnmkt.github.io/minesweeper](https://bnmkt.github.io/minesweeper/)

Dans un premier temps nous allons créer la base de notre jeu du démineur!

**1.1 Créer la fonction Demineur**

Notre fonction a besoin d'un paramètre qui va être un élément HTML

```js
    var Demineur = function(element){
    
    };
```

**1.2 Définir les variables globale**

Je sais que vous ne connaissez qu'une seule façon de créer des variables mais pour des raisons techniques je vais vous demander de vous familiariser avec les variables `let` qui contrairement aux autres variables ont une portée limitée

Par exemple :

```js
function test(){
	var foo = "bar";
}
foo // = bar
/* --- */
function test(){
	let foo = "bar";
}
foo // = variable non définie
```
L'avantage des variables let est qu'on ne mélange pas les données des différentes fonctions.

Voilà maintenant que cette parenthèse est faite, voici les variables que nous allons utiliser dans notre projet :
```js
let width,	 	// La largeur du tableau
	height,	 	// la hauteur du tableau
	maxBombs,	// Le nombre de bombes maximum possible dans le tableau
	playing, 	// Booléen qui indique si on est en train de jouer ou non
	tab, 		// Tableau qui contient les bombes
	userTab, 	// Tableau découvert par l'utilisateur
	container, 	// Élément HTML qui contient le tableau de jeu
	placedBomb;	// le nombre de bombes placée dans le tableau
```
Il manque des valeurs à ces variables, vous devriez être capable de donner une valeur à au moins 2 d'entre elles, ces deux variable sont des tableau, vous avez juste à les définir comme étant des tableaux vide.
Une autre variable a besoin d'être définie, c'est `container`, vous devez créer une variable conditionnelle, si `element` a été indiqué a la fonction vous utilisez cette valeur sinon vous utilisez la balise `body` comme élément par défaut pour le jeu.

Solution :
```js
	let width,
		height,
		maxBombs,
		playing,
		tab = [],
		userTab = [],
		container = (element) ? document.querySelector(element) : document.querySelector("body"),
		placedBomb;
```
Vous aviez aussi la possibilité de demander à ce que `element` soit un élément HTML directement :
```js
	container = (element) ? element : document.querySelector("body"),
```
**1.3 Les méthodes et fonctions**

Pour cette partie ci nous allons faire plutôt simple, je vais vous lister les méthodes et les fonctions que notre fonction Demineur aura, nous n'allons pas coder dedans, nous allons juste les définir.

**1.3.1 Les méthodes de récupération**

Avant tous, il faut comprendre que pour pouvoir utiliser une fonction à l'extérieur du Demineur, nous allons utiliser `this` qui correspond à `Demineur`. Je vais vous donner un exemple, à vous de faire le reste.
```js
this.getWidth(){		// Retourne la largeur du tableau
	return width;
}
this.getHeight(){}		// Retourne la hauteur du tableau
this.getBombNumber(){}	// Retourne le nombre de bombre
this.getTabs(){}		// Retourne les tableaux
```
Vous devez certainement vous poser une question... Pourquoi faire ça ?

Ben en fait, pour rien dans ce projet-ci mais dans d'autre projets, vous aurez besoin de pouvoir accéder à des données interne à l'extérieur de la fonction. Ici nous faisons juste ça pour que vous puissiez comprendre comment faire pour créer une méthode.

**1.3.2 Les méthodes qui permettent d'agir sur le jeu**

Ici nous allons créer 3 méthodes qui vont agit sur le jeu, par contre leur contenu sera un peu spécial, ne vous inquiétez pas, je vous expliquer dans les temps pourquoi.

```js
this.start(x, y, n){	// Démarre le jeu
	x = x ? x : width;
	y = y ? y : height;
	n = n ? n : maxBombs;
	start(x, y, n);
}
this.pause(){			// Met le jeu en pause
	pause();
}
this.resume(){			// Permet de reprendre la partie en cours
	resume();
}
```
À l’exception de `this.start` vous voyez que dans les méthodes ci dessus, nous n'effectuons qu'une action, ne vous méprenez pas, je n'appelle pas la fonction dans sa méthode, les fonctions que vous voyez sont d'autre fonctions que nous allons définir plus tard, la raison pour laquelle nous faisons comme ça est comme dans beaucoup de cas, une question de portée...

```js
var test = function(){
	this.foo = "bar";
}
// Dans ce cas ci, test.foo renverra "bar" cas this correspond à test()
var test = function(){
	this.foo = function(){
		return "bar";
	}
	this.test2 = function(){
		return this.foo;
	}
}
// Alors qu'ici, test.test2.foo ne fonctionnera pas car nous n'avons pas de méthode foo dans test2
```
Ok mais pourquoi `this.start` est différent ? En fait nous allons juste préparer la suite.

Nous allons terminer cette partie avec quelque fonction utilitaire

**1.3.3 Les fonctions utilitaire**

J'appelle fonction utilitaire, tout ce qui pourra nous être utile par la suite dans le code.
Il y a 4 fonctions, une qui permet de changer la valeur de la variable width, une pour la variable height, une pour le nombre de bombes et pour finir une pour générer des nombre aléatoires.
```js
/* 
La fonction random ci-dessous génère un nombre aléatoire entre 0 et 1 grâce à Math.random()
Nous multiplions ce nombre par la valeur maximale que nous voulons avoir
Nous arrondissons vers le bas grâce à Math.floor
Et enfin nous additionnons un nombre minimum

Étape par étape :
Nous voulons un nombre entre 1 et 3
Math.random() donne la valeur 0.7452875
Nous la multiplions par max (ici 3) ça donne 2.2358625
Nous l'arrondissons vers le bas ce qui nous donne 2
Nous additionnons le nombre minimum 1, ce qui nous donne 3, 
c'est un nombre entre 1 et 3
*/
	function random(min, max) {
		return Math.floor(Math.random() * max) + min;
	}
/*
Le setWidth est une variable conditionnelle,
Si w est défini, nous traduisons w en base 10
Si il ne l'est pas, nous donnons une largeur par défaut à 10

Les 3 fonctions en dessous fonctionnent sur le même schéma.
*/
	function setWidth(w) {
		width = w ? parseInt(w, 10) : 10;
	}
	function setHeight(h) {
		height = h ? parseInt(h, 10) : 10;
	}
	function setBombsNumber(n) {
		maxBombs = n ? parseInt(n, 10) : 10;
	}
```

**2. Les tableaux**

Ici nous allons donc générer les tableaux du Demineur.

Nous allons avoir ici des tableaux à deux dimension, une dimension x et une dimension y.

x correspond à la ligne, à chaque rangées.

y correspond à chaque colonnes;
```js
// Voici un tableau de 10 sur 10
[
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]
```
**2.1 La génération des tableaux**

Concrètement nous allons générer un tableau comme ça, pour le faire, nous allons utiliser deux boucle, une pour chaque dimension.

Dans une première boucle, nous allons définir chacune des lignes

```js
for(let x = 0; x < width; x++){
	tab[x] = []; 		// création des lignes pour le tableau qui contient des bombes
	userTap[x] = []; 	// création des lignes pour le tableau avec lequel l'utilisateur pourra agir
}
// Ici les deux tableaux ressemblent à ça : [[],[],[],[], ...]
// Aucune valeur n'est définie car nous n'avons que les lignes du démineur
```
Dans la seconde boucle, pour chacune des lignes nous allons y insérer des colonnes, des premières valeurs.
```js
// La boucle ici s'insère directement après ce que nous avons fait au dessus
for(let y = 0; y < height; y++){
	tab[x][y] = " "; 		// Nous insérons un caractère vide pour avoir une valeur valide
	userTab[x][y] = "X";	// Dans le tableau des utilisateurs, on place un X comme valeur par défaut
}
```
**2.2 Placement des bombes**

Le placement des bombes est plutôt simple, il suffit simplement de générer deux nombres aléatoire qui vont correspondre à des positions dans un tableau à deux dimension.

**2.2.1 Calcul des position + placement dans le tableau**

Ici nous allons donc faire une boucle grâce à maxBombs qui défini le nombre maximum de bombes dans notre jeu.

Ensuine nous allons définir deux variables `bombPosX` la position de la bombe sur l'axe X et `bombPosY` la position de la bombre sur l'axe Y.

Nous allons nous servir de la fonction random() qu'on a créer au dessus, on a besoin d'un nombre min et d'un nombre max.

Pour décider de placer une bombe dans le tableau, nous utiliserons le caractère "x", avant de le placer et surtout pour la partie qui suit, nous auront aussi besoin de vérifier si une bombe n'as pas déjà été placée ici
```js
for(let b = 0; b < maxBombs; b++){
	let bombPosX = random(0, width);	// Width étant la largeur du tableau, on ne peut pas aller plus loin
	let bombPosY = random(0, height);	// De même pour height
	
	if(tab[bombPosX][bombPosY] != "x"){	// Si une bombe n'est pas déjà placée
		tab[bombPosX][bombPosY] = "x";	// Avec ça nous ajoutons une bombes dans le tableau à la position bombPosX et bombPosY
	}
}
```
**2.2.2 Les nombre autour des bombes**

Dans un démineur, on peut voir où se trouvent les bombes grâce à des nombre qui se trouve autour.

Toujours dans la boucle du dessus, après avoir fait la vérification et après avoir placé la bombe, nous allons devoir afficher un nombre autour de celle-ci.
```js
[
	0, 0, 0,
	0,"x",0,
	0, 0, 0
]
```
Voici une bombe, avec autour d'elle des 0. nous allons devoir incrémenter chacun de ces 0, le tout sans toucher à la bombe, il faut laisser le "x" là où il est !
> y - 1 ET x - 1  ;  y - 1 ET x - 0 ; y - 1 ET x + 1
> 
> y - 0 ET x - 1  ;   Pas toucher  ; y - 0 ET x + 1
> 
> y + 1 ET x - 1  ;  y + 1 ET x - 0 ; y + 1 ET x + 1

Au dessus, je vous dis que vous devez faire 3 boucles pour chaque Y et dans chacune de ces boucle vous allez refaire 3 boucles pour les X.

À l'intérieur de ces deux boucle, vous allez donc vérifier si cet élément existe dans le tableau, dans le cas où une bombe serait placée sur une extrémité, les positions peuvent ne pas exister, il faut donc prendre en compte cette possibilité.

Une fois cette vérification faite pour les lignes et les colonnes, il faut maintenant vérifier si un nombre est bien présent car je vous rappelle que pendant la génération du tableau nous avons mis une espace dans le but d'avoir un caractère valide, nous devons donc vérifier cela et si c'est le cas, nous pouvons maintenant le remplacer par un 0.

Une fois que c'est fait on sort de cette vérification et nous pouvons donc incrémenter le nombre à la position où  nous nous trouvons !

Cette partie ci est plutôt compliquée, je vous donne le code commenté, essayez de le lire avec les explications à coté.
```js
if (tab[bombPosX][bombPosY] != "x") {
	tab[bombPosX][bombPosY] = "x";
	for (let vy = -1; vy <= 1; vy++) {
		for (let vx = -1; vx <= 1; vx++) {
			let nx = bombPosX + vx;
			let ny = bombPosY + vy;
			if (tab[nx]) { // Si la ligne existe
				if (tab[nx][ny]) { // Si la colonne existe
					if (tab[nx][ny] == " ") { // si la valeur du tableau est toujours celle par défaut
						tab[nx][ny] = 0;
					}
					tab[nx][ny]++; // incrémentation de la valeur du tableau
				} // fin de si la colonne existe
			} // Fin de si la ligne existe
		} // fin de la boucle de vx
	} // Fin de la boucle de vy
} // Fin de la vérification : si une bombe est présente
```
**2.2.3 Affichage du tableau dans l'HTML**

Dans cette partie ci nous allons créer un tableau en HTML avec JS, et pour chacune des cellule nous créer un événement au click.

Le code est plutôt long mais dans beaucoup de cas nous allons toucher aux même éléments.

Tout d'abord nous allons chercher si un tableau d'id "game" existe déjà

Si oui nous allons le vider, si non nous allons en créer un, 

Ensuite nous allons refaire deux boucle pour afficher l'intégralité du tableau, d'abord une boucle pour les lignes suivie d'une pour les colonnes.

Dans la boucle pour les lignes nous allons créer un élément html tr et nous allons l'ajouter au tableau

Dans celle pour les colonnes nous allons créer un élément html td auquel nous ajoutons un attribut personnel "data-x" qui prendra la valeur de x et un attribut personnel "data-y" qui prendra la valeur de y. Toujours pour cette cellule nous allons lui donner comme texte sa valeur dans userTab, et pour finir nous lui ajoutons un événement au click qui lancera une fonction qu'on fera plus tard.

Puis nous allons insérer cette cellule dans notre ligne.
```js
function displayTabs() {
	let table = document.getElementById("game")
	if (table) {
		table.innerHTML = "";
	} else {
		table = document.createElement("table")
		table.setAttribute("id", "game");
	}
	for (let x = 0; x < width; x++) {
		let row = document.createElement("tr");
		row.setAttribute("id", "r" + x)
		for (let y = 0; y < height; y++) {
			let cell = document.createElement("td")
			cell.setAttribute("data-x", x);
			cell.setAttribute("data-y", y);
			cell.innerText = userTab[x][y];
			cell.addEventListener("click", checkBomb);
			row.appendChild(cell);
		}
		table.appendChild(row);
	}
	container.appendChild(table);
}
```
Voilà, avec ça vous avez déjà une très bonne base, il ne nous reste plus qu'à gérer les événement au click ainsi que toutes les vérifications qui en découlent et à fait l'initialisation du jeu (pause, play, resume et le restart)