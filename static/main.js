async function showDetails(adId, event) {
  event.stopPropagation();
  const alreadyHasExtraDetails = document.getElementById(`extraDetails${adId}`);
  if (alreadyHasExtraDetails === null) {
    const getDetails = await fetch(`/api/showDetails/${adId}`);
    const recievedDetails = await getDetails.json();
    const idName = `details${adId}`;
    const detailsDiv = document.getElementById(idName);
    const { szobakSzama, datum } = recievedDetails;

    const nrBerdroomsLi = document.createElement('li');
    const nrBerdroomsText = document.createElement('strong');
    const nrBerdrooms = document.createTextNode(szobakSzama.toString());
    nrBerdroomsText.appendChild(document.createTextNode('Number of bedrooms: '));
    nrBerdroomsLi.appendChild(nrBerdroomsText);
    nrBerdroomsLi.appendChild(nrBerdrooms);
    nrBerdroomsLi.setAttribute('id', `extraDetails${adId}`);

    const dateLi = document.createElement('li');
    const dateText = document.createElement('strong');
    const date = document.createTextNode(datum.toString());
    dateText.appendChild(document.createTextNode('Date: '));
    dateLi.appendChild(dateText);
    dateLi.appendChild(date);

    detailsDiv.appendChild(nrBerdroomsLi);
    detailsDiv.appendChild(dateLi);
  }
}

async function torol(imageId) {
  const deleteImage = await fetch(`/api/torol/${imageId}`);
  if (deleteImage.status < 400) {
    const imageAndDeleteButton = Array.from(document.getElementsByClassName(imageId));
    imageAndDeleteButton.forEach((element) => {
      element.remove();
    });
    alert('Photo succesfully deleted');
  } else {
    alert('There was an error while trying to delete the photo');
  }
}

async function deleteAd(adId, event) {
  event.stopPropagation();
  const deletedAd = await fetch(`/api/deleteAd/${adId}`);
  if (deletedAd.status < 400) {
    const adDiv = document.getElementById(`div${adId}`);
    while (adDiv.firstChild) {
      adDiv.removeChild(adDiv.firstChild);
    }
    adDiv.remove();
  } else {
    console.error('There was an error while trying to delete the ad');
  }
}

async function changeRole(userName) {
  const roleRow = document.getElementById(userName);
  const role = roleRow.innerText;
  console.log(role);
  let changed;
  if (role === 'Admin') {
    changed = await fetch(`/api/changeRoleToUser/${userName}`);
  } else {
    changed = await fetch(`/api/changeRoleToAdmin/${userName}`);
  }
  if (changed.status < 400) {
    const td = document.createElement('td');
    let textRole,
      textButton,
      textButtonsText;
    if (role === 'Admin') {
      textRole = document.createTextNode('User');
      textButton = document.createElement('text');
      textButtonsText = document.createTextNode('Change role to admin');
      textButton.appendChild(textButtonsText);
    } else {
      textRole = document.createTextNode('Admin');
      textButton = document.createElement('text');
      textButtonsText = document.createTextNode('Change role to user');
      textButton.appendChild(textButtonsText);
    }

    td.appendChild(textRole);
    td.setAttribute('id', userName);
    roleRow.remove();
    const roleRowAfter = document.getElementById(`parent${userName}`);
    roleRowAfter.insertBefore(td, roleRowAfter.children[1]);

    const oldButtonText = document.getElementById(`roleText${userName}`);
    oldButtonText.remove();
    const button = document.getElementsByClassName(`role${userName}`);
    console.log(button[0], textButton);
    textButton.setAttribute('id', `roleText${userName}`);
    console.log(textButton);
    button[0].append(textButton);
  } else {
    console.error('There was an error while trying to change user role');
  }
}
