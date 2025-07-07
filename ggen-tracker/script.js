let unitsData = {};
let ownedUnits = new Set();

fetch('units.json')
  .then(response => response.json())
  .then(data => {
    unitsData = data;
    renderUnitList();
  });

function renderUnitList() {
  const unitListDiv = document.getElementById('unit-list');
  unitListDiv.innerHTML = '';

  Object.keys(unitsData).forEach(series => {
    const seriesDiv = document.createElement('div');
    seriesDiv.className = 'series';
    seriesDiv.innerHTML = `<strong>${series}</strong>`;

    const rarities = unitsData[series];
    Object.keys(rarities).forEach(rarity => {
      const rarityDiv = document.createElement('div');
      rarityDiv.className = 'rarity';
      rarityDiv.innerHTML = `<em>${rarity}</em>`;

      rarities[rarity].forEach(unit => {
        const unitDiv = document.createElement('div');
        unitDiv.className = 'unit';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = unit.id;
        checkbox.checked = ownedUnits.has(unit.id);
        checkbox.addEventListener('change', (e) => {
          if (e.target.checked) {
            ownedUnits.add(unit.id);
          } else {
            ownedUnits.delete(unit.id);
          }
        });

        unitDiv.appendChild(checkbox);
        unitDiv.append(` ${unit.name}`);
        rarityDiv.appendChild(unitDiv);
      });

      seriesDiv.appendChild(rarityDiv);
    });

    unitListDiv.appendChild(seriesDiv);
  });
}

document.getElementById('save-btn').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const encryptedPassword = encrypt(password);

  const accountData = {
    email: email,
    password: encryptedPassword,
    unitsOwned: Array.from(ownedUnits)
  };

  const blob = new Blob([JSON.stringify(accountData, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'account_data.json';
  link.click();
});

document.getElementById('load-btn').addEventListener('click', () => {
  document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const accountData = JSON.parse(event.target.result);
    document.getElementById('email').value = accountData.email;
    document.getElementById('password').value = decrypt(accountData.password);
    ownedUnits = new Set(accountData.unitsOwned);
    renderUnitList();
  };
  reader.readAsText(file);
});