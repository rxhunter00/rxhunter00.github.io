const SECRET_KEY = 'YOUR_SECRET_KEY';

function encrypt(text) {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

function decrypt(cipher) {
  return CryptoJS.AES.decrypt(cipher, SECRET_KEY).toString(CryptoJS.enc.Utf8);
}