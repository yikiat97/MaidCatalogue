const formData = new FormData();
formData.append('file', selectedFile);

const res = await fetch('http://54.169.107.115:3000/api/upload', {
  method: 'POST',
  body: formData,
  credentials: 'include' // ✅ ensures cookies (like JWT) are sent
});

const data = await res.json();
console.log(data.filePath);
