/*
	Mr21 - 1.1
	https://github.com/Mr21/diff.js
*/

function diff(a, b) {
	var i, j, line;
	// create table
	var tab = new Array(a.length + 1);
	for (i = tab.length - 1; i >= 0; --i) {
		tab[i] = new Array(b.length + 1);
		tab[i][0] = 0;
	}
	for (i = b.length; i > 0; --i)
		tab[0][i] = 0;
	// fill table
	for (i = 1; line = tab[i]; ++i)
		for (j = 1; j < line.length; ++j)
			tab[i][j] = a[i-1] === b[j-1]
				? 1 + tab[i-1][j-1]
				: Math.max(tab[i-1][j], tab[i][j-1]);
	// backtrack
	var seq = [];
	i = a.length;
	j = b.length;
	for (; i > 0; --i) {
		var v = tab[i][j];
		while (j > 0 && tab[i][j-1] === v)
			--j;
		if (tab[i-1][j] < tab[i][j])
			seq[tab[i][j] - 1] = a[i-1];
	}
	// write the diff
	var iA = 0, iB = 0, iX = 0,
	    arr = [];
	while (iA < a.length || iB < b.length) {
		if (a[iA] !== seq[iX])
			arr.push(['-', a[iA++]]);
		if (b[iB] !== seq[iX])
			arr.push(['+', b[iB++]]);
		else if (a[iA] === b[iB]) {
			arr.push([' ', a[iA++]]);
			++iB;
			++iX;
		}
	}
	return arr;
}
