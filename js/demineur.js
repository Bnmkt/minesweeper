var Demineur = function (nbCol, nbRow, maxBomb, element) {
	let width = nbCol,
		height = nbRow,
		bombNumber = maxBomb,
		playing,
		tab = [],
		userTab = [],
		container,
		placedBomb;
	this.getWidth = function () {
		return width;
	}
	this.getHeight = function () {
		return height;
	}
	this.getBombNumber = function () {
		return bombNumber;
	}
	this.getContainer = function () {
		return container;
	}
	this.start = function (x, y, n) {
		document.getElementById("start").value = "Restart";
		console.log(x + " " + y + " " + n)
		x = x ? x : width;
		y = y ? y : height;
		n = n ? n : bombNumber;
		start(x, y, n);
	}
	this.pause = function () {
		pause();
		document.getElementById("pause").setAttribute("onclick", "game.resume()");
		document.getElementById("pause").value = "Resume";
	}
	this.resume = function () {
		resume();
		document.getElementById("pause").setAttribute("onclick", "game.pause()");
		document.getElementById("pause").value = "Pause";
	}

	function setWidth(w) {
		width = w ? parseInt(w, 10) : 10;
	}

	function setHeight(h) {
		height = h ? parseInt(h, 10) : 10;
	}

	function setBombsNumber(n) {
		bombNumber = n ? parseInt(n, 10) : 10;
	}

	function start(x, y, n) {
		container = (element) ? document.querySelector(element) : document.querySelector("body")
		setWidth(x);
		setHeight(y);
		setBombsNumber(n);
		resume();
		init();
	}

	function resume() {
		container.classList.remove("unvisible");
		playing = true;
	}

	function pause() {
		container.classList.add("unvisible");
		playing = false;
	}

	function setTabs(tabWidth, tabHeight) {
		let width = tabWidth,
			height = tabHeight;
		for (let x = 0; x < width; x++) {
			tab[x] = [];
			userTab[x] = []
			for (let y = 0; y < height; y++) {
				tab[x][y] = " ";
				userTab[x][y] = "X";
			}
		}
	}

	function setBombs() {
		let nb = 0;
		for (let b = 0; b < bombNumber; b++) {
			let bombPosX = random(0, width);
			let bombPosY = random(0, height);
			if (tab[bombPosX][bombPosY] != "x") {
				for (let vx = 0; vx <= 2; vx++) {
					for (let vy = 0; vy <= 2; vy++) {
						let nx = bombPosX + (vx - 1);
						let ny = bombPosY + (vy - 1);
						if (tab[nx]) {
							if (tab[nx][ny]) {
								if (tab[nx][ny] == " ") {
									tab[nx][ny] = 0;
								}
								if (tab[nx][ny] > -1) {
									tab[nx][ny]++;
								}
							}
						}
					}
				}
				nb++;
				tab[bombPosX][bombPosY] = "x";
			}
		}
		placedBomb = nb;
	}

	function random(min, max) {
		return Math.floor(Math.random() * max) + min;
	}

	function displayTabs(trueTab) {
		let table = document.getElementById("game")
		if (table) {
			table.innerHTML = "";
		} else {
			table = document.createElement("table")
			table.setAttribute("id", "game");
			table.setAttribute("data-finish", playing);
		}
		let selectedTab = trueTab ? tab : userTab;
		for (let x = 0; x < width; x++) {
			let row = document.createElement("tr");
			row.setAttribute("id", "r" + x)
			for (let y = 0; y < height; y++) {
				let cell = document.createElement("td")
				cell.setAttribute("data-x", x);
				cell.setAttribute("data-y", y);
				cell.setAttribute("data-bomb", (tab[x][y] != "x") ? "true" : "false");
				cell.setAttribute("data-viewed", selectedTab[x][y] != "X" ? true : false);
				cell.innerText = (selectedTab[x][y] != "x") ? selectedTab[x][y] : "v";
				cell.addEventListener("click", checkBomb);
				row.appendChild(cell);
			}
			table.appendChild(row);
		}
		container.appendChild(table);
	}

	function ifZero(y, x) {
		x = parseInt(x)
		y = parseInt(y)
		for (let ny = -1; ny <= 1; ny++) {
			for (let nx = -1; nx <= 1; nx++) {
				var zx = nx + x
				var zy = ny + y
				if (tab[zy]) {
					if (tab[zy][zx] === " ") {
						if (userTab[zy][zx] == "X") {
							userTab[zy][zx] = tab[zy][zx];
							ifZero(zy, zx)
							contourZero(zy, zx)
						}
					}
				}
			}
		}
	}

	function contourZero(y, x) {
		x = parseInt(x)
		y = parseInt(y)
		for (let ny = -1; ny <= 1; ny++) {
			for (let nx = -1; nx <= 1; nx++) {
				let zx = nx + x
				let zy = ny + y
				if (tab[zy]) {
					if (tab[zy][zx]) {
						if (tab[y + ny][zx] != "v") {
							if (userTab[y + ny][zx] == "X") {
								userTab[zy][zx] = tab[zy][zx];
							}
						}
					}
				}
			}
		}
	}

	function checkBomb(e) {
		let x = e.currentTarget.getAttribute("data-x");
		let y = e.currentTarget.getAttribute("data-y");
		if (!playing) {
			start(width, height, bombNumber);
		} else {
			if (tab[x][y] == "x") {
				playing = false;
				displayTabs(1)
			} else {
				userTab[x][y] = tab[x][y];
				e.currentTarget.setAttribute("data-viewed", "true");
				ifZero(x, y)
				displayTabs();
			}
		}
	}

	function init() {
		tab = [];
		userTab = [];
		setTabs(width, height);
		setBombs()
		displayTabs();
		document.getElementById("x").innerText = width + " Rangée";
		document.getElementById("y").innerText = height + " Colonnes";
		document.getElementById("bomb").innerText = placedBomb + " Bombes placées";
	}
};
