var Demineur = function (element) {
	let width,
		height,
		maxBombs,
		playing,
		tab = [],
		userTab = [],
		placedBomb,
		container = (element) ? document.querySelector(element) : document.querySelector("body");
	this.getWidth = function () {
		return width;
	}
	this.getHeight = function () {
		return height;
	}
	this.getBombNumber = function () {
		return maxBombs;
	}
	this.getContainer = function () {
		return container;
	}
	this.start = function (x, y, n) {
		x = x ? x : width;
		y = y ? y : height;
		n = n ? n : maxBombs;
		start(x, y, n);
	}
	this.pause = function () {
		pause();
	}
	this.resume = function () {
		resume();
	}

	function setWidth(w) {
		width = w ? parseInt(w, 10) : 10;
	}

	function setHeight(h) {
		height = h ? parseInt(h, 10) : 10;
	}

	function setBombsNumber(n) {
		maxBombs = n ? parseInt(n, 10) : 10;
	}

	function start(x, y, n) {
		document.getElementById("start").value = "Restart";
		setWidth(x);
		setHeight(y);
		setBombsNumber(n);
		playing = true;
		resume();
		init();
	}

	function resume() {
		document.getElementById("pause").setAttribute("onclick", "game.pause()");
		document.getElementById("pause").value = "Pause";
		container.classList.remove("unvisible");
		playing = true;
	}

	function pause() {
		document.getElementById("pause").setAttribute("onclick", "game.resume()");
		document.getElementById("pause").value = "Resume";
		container.classList.add("unvisible");
		playing = false;
	}

	function setTabs() {
		for (let x = 0; x < width; x++) {
			tab[x] = [];
			userTab[x] = [];
			for (let y = 0; y < height; y++) {
				tab[x][y] = " ";
				userTab[x][y] = "X";
			}
		}
	}

	function setBombs() {
		let nb = 0;
		for (let b = 0; b < maxBombs; b++) {
			let bombPosX = random(0, width);
			let bombPosY = random(0, height);
			if (tab[bombPosX][bombPosY] != "x") {
				nb++;
				tab[bombPosX][bombPosY] = "x";
				for (let vx = -1; vx <= 1; vx++) {
					for (let vy = -1; vy <= 1; vy++) {
						let nx = bombPosX + vx;
						let ny = bombPosY + vy;
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
				cell.innerText = (selectedTab[x][y] != "x") ? selectedTab[x][y] : "x";
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
						if (tab[y + ny][zx] != "x") {
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
			start(width, height, maxBombs);
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
		setTabs();
		setBombs()
		displayTabs();
		document.getElementById("x").innerText = width + " Rangée";
		document.getElementById("y").innerText = height + " Colonnes";
		document.getElementById("bomb").innerText = placedBomb + " Bombes placées";
	}
};
