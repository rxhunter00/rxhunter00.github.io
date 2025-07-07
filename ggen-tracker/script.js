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
    const seriesCard = document.createElement('div');
    seriesCard.className = 'card mb-4';

    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header fw-bold';
    cardHeader.textContent = series;

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const rarities = unitsData[series];
    Object.keys(rarities).forEach(rarity => {
      const rarityTitle = document.createElement('h6');
      rarityTitle.className = 'fw-semibold';
      rarityTitle.textContent = rarity;
      cardBody.appendChild(rarityTitle);

      const row = document.createElement('div');
      row.className = 'row mb-3';

      rarities[rarity].forEach(unit => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-2';

        const formCheck = document.createElement('div');
        formCheck.className = 'form-check form-switch';

        const checkbox = document.createElement('input');
        checkbox.className = 'form-check-input';
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

        const label = document.createElement('label');
        label.className = 'form-check-label';
        label.htmlFor = unit.id;
        label.textContent = unit.name;

        formCheck.appendChild(checkbox);
        formCheck.appendChild(label);
        col.appendChild(formCheck);
        row.appendChild(col);
      });

      cardBody.appendChild(row);
    });

    seriesCard.appendChild(cardHeader);
    seriesCard.appendChild(cardBody);
    unitListDiv.appendChild(seriesCard);
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
