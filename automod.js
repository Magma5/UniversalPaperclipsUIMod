var automodFeatures = {};

function addToggle(feature) {
	var btn = document.createElement('button');
	btn.setAttribute('onClick', 'runToggle("' + feature + '")');
	btn.setAttribute('class', 'button2');
	btn.innerHTML = feature;

	var lbl = document.createElement('span');
	lbl.innerHTML = 'OFF';
	lbl.style.margin = "0 3px";

	var divAutoMod = document.getElementById('divAutoMod');
	divAutoMod.appendChild(btn);
	divAutoMod.appendChild(lbl);

	automodFeatures[feature] = {
		toggle: false,
		button: btn,
		label: lbl
	}
}

function runToggle(feature) {
	let toggle = automodFeatures[feature];
	toggle.toggle = !toggle.toggle;
	toggle.label.innerHTML = (toggle.toggle ? 'ON' : 'OFF');
}

function getToggle(feature) {
	return automodFeatures[feature].toggle;
}

function predictWinner() {
	let maxIdx = 0;
	let maxScore = 0;

	for (let i = 0; i < strats.length; i++) {
		if (strats[i].currentScore > maxScore) {
			maxIdx = i;
			maxScore = strats[i].currentScore;
		}
	}

	return maxIdx;
}

function automod_loop() {
	if (humanFlag == 1) {
		let autoPrice = getToggle('AutoPrice');
		let autoWire = getToggle('AutoWire');
		let autoInvest = getToggle('AutoInvest');

        let clipRate = clipperBoost * clipmakerLevel + megaClipperBoost * (megaClipperLevel * 500);

		if (autoPrice && clipRate > 0) {
            let avgSalesLower;
            if (margin > 0.015) {
                let d = demand * margin / (margin - 0.01);
                let chance = d / 100;
                if (chance > 1) chance = 1;
                avgSalesLower = chance * (.7 * Math.pow(d, 1.15)) * 10;
            }

            let chance = demand / 100;
            if (chance > 1) chance = 1;
            let avgSales = chance * (.7 * Math.pow(demand, 1.15)) * 10

			if (avgSales > clipRate) {
                if (margin < 10) {
                    raisePrice();
                }
			} else if (margin > 0.015 && avgSalesLower < clipRate) {
				lowerPrice();
			}
		}

		if (autoWire && wire < 500) {
			buyWire()
		}

        if (autoInvest) {
            if (autoClipperFlag == 0) {
                clipClick(1);
            } else if (avgRev * 2 > adCost) {
                buyAds();
            } else if (clipmakerLevel < 75) {
                makeClipper();
            } else if (megaClipperLevel < 35) {
                if (megaClipperFlag == 1) {
                    makeMegaClipper();
                }
            } else if (project37.flag == 0) {
                if (activeProjects.indexOf(project37) == -1) {
                    investDeposit();
                } else if (project37.cost()) {
                    project37.effect();
                } else if (bankroll > 0) {
                    investWithdraw();
                }
            } else if (megaClipperLevel < 70) {
                makeMegaClipper();
            } else if (project38.flag == 0) { // takeover
                if (project38.cost() && activeProjects.indexOf(project38) != -1) {
                    project38.effect();
                }
            } else if (megaClipperLevel < 100) {
                makeMegaClipper();
            } else if (investLevel < 5) {
                if (yomi > investUpgradeCost) {
                    investUpgrade();
                }
            } else if (clips < 122000000) {
                document.getElementById('investStrat').value = "hi"
                if (funds > 1000000) {
                    investDeposit();
                }
            } else if (bankroll > 0) {
                investWithdraw();
            } else if (project40b.trigger() && project40b.cost()) {
                project40b.effect();
            }
        }
	}

	let autoQuantum = getToggle('AutoQuantum');
	let autoTourney = getToggle('AutoTourney');
	let autoTrust = getToggle('AutoTrust');

	if (autoQuantum) {
		let q = 0;
		for (var i = 0; i < qChips.length; i++){
			q = q + qChips[i].value;
		}
		if (q > 0.1 && memory * 1000 > standardOps) {
			qComp();
		}
	}

	if (autoTourney) {
        let stratPicker = document.getElementById('stratPicker');

        if (project62.flag == 1 && payoffGrid.valueAA == 0 && payoffGrid.valueAB == 0 && payoffGrid.valueBA == 0 && payoffGrid.valueBB == 0) {
			newTourney();
			runTourney();
        } else if ((resultsFlag == 1) && operations >= tourneyCost) {
			newTourney();
			runTourney();
		}
		stratPicker.value = predictWinner();
	}

	if (autoTrust) {
		if (trust > processors + memory || swarmGifts > 0) {
			if (processors < 5) addProc();
			else if (memory < 10) {
				if (project19.flag == 1 && creativity > 70) addMem();
			}
			else if (memory < 50) addMem();
			else if (processors < 20) addProc();
			else if (memory < 80) addMem();
			else if (processors < 60) addProc()
			else if (memory < 100) addMem();
			else if (processors < 100) addProc();
			else if (memory < 120) addMem();
			else if (processors < 150) addProc();
			else if (memory < 175) addMem();
			else if (processors < 200) addProc();
			else if (memory < 250) addMem();
			else if (processors < 500) addProc();
			else if (memory < 350) addMem();
			else addProc();
		}
	}

	const projectOrder = [
		2, // creativity
		5, 13, 14, 15, 16, 19, // +trust
		17, // clip diagram
		45, 46, // quantum
		38, 0, 6, 3, 7, 4, // revtracker, clip1, wire1, clip2, wire2, clip3
		11, 12, 27, // new slogan, catchy jingle, -1 trust
		22, // megaclippers
		26, // wirebuyer
		8, // wire 3
		21, 20, // trading, yomi
		9, // wire 4
		23, 24, // megaclipper 1,2
		47, 48, // A100, B100
		25, // megaclipper 3
		49, // Greedy
		30, 34, 31,  // +trust
        50, // generous
		33, // global warming
		// 36, 37, // takeover, monopoly
		32, // world peace
		51, 52, 53, // all strats
		10, // wire 5
		42, // goodwill 1
		28, 29, // hypnodrones
		18, 66, 35, 39, 40, 41, // begin of stage 2
		64, 65, // momentum, swarm
		61, // theory of mind
		44, // go to stage 3
		75, 76, 77, 78, 79, 80, 81, 82 // accept
	]

	let autoProjects = getToggle('AutoProjects');
	if (autoProjects) {
        let success = 0;
		for (let i in projectOrder) {
			let p = projectOrder[i];
			if (projects[p].flag == 0) {
                // Don't do -trust if can't afford megaclippers
                if (p == 27 && memory < 12) {
                    break;
                }
				if (activeProjects.indexOf(projects[p]) != -1 && projects[p].cost()) {
					projects[p].effect();
                    success = true;
				}
				break;
			}
		}

        if (!success && project51.flag == 1 && nextQchip < 3 && project51.cost()) {
            project51.effect();
        }
	}

}

function automod_ready() {
	var divAutoMod = document.getElementById('divAutoMod');
	if (divAutoMod === null) {
		setInterval(function() { automod_loop() }, 100);
	} else {
		divAutoMod.remove();
	}

	divAutoMod = document.createElement('div');
	divAutoMod.setAttribute('id', 'divAutoMod');
	divAutoMod.style.marginBottom = '8px'
	document.getElementById('topDiv').appendChild(divAutoMod);

	addToggle('AutoPrice');
	addToggle('AutoInvest');
	addToggle('AutoWire');
	addToggle('AutoQuantum');
	addToggle('AutoTourney');
	addToggle('AutoTrust');
	addToggle('AutoProjects');

}

if (document.readyState !== 'loading') {
	automod_ready();
} else {
	document.addEventListener('DOMContentLoaded', automod_ready);
}
